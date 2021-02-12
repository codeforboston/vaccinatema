import requests
import json
import logging

from . import Notifier

logger = logging.getLogger(__name__)

class SlackNotifier(Notifier):
    ICON_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/220px-SARS-CoV-2_without_background.png'

    def __init__(self, slack_token, slack_channel, slack_username):
        self.slack_token = slack_token
        self.slack_channel = slack_channel
        self.slack_username = slack_username

    def notify(self, slots):
        text = "Vaccination appointment%s found for *%s*:" % ("s" if len(slots.slots) > 1 else "", slots.location)
        sections = [text, {"type": "divider"}] + ["%s" % s for s in slots.slots] + [self.slack_action_block(("Visit Site", slots.url))]
        blocks = self.slack_markdown_blocks(*sections)
        logger.info("Sending notification: %s" % blocks)
        post = self.slack_post("%s %s" % (text, " ".join([s for s in slots.slots])), blocks)
        is_ok = post.get('ok', False)
        if not is_ok:
            logger.error("Problem querying slack API: %s Excluding blocks" % post)
            post = self.slack_post("%s %s" % (text, " ".join([s for s in slots.slots])))
            logger.warning(post)
        else:
            logger.info("Successfully posted to Slack API: %s" % post)

    
    def notify_problem(self, message):
        logger.warning(self.slack_post(message))
    
    def slack_markdown_blocks(self, *args):
        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": t
                }
            } if type(t) == str else t for t in args
        ]
    
    def slack_action_block(self, *args):
        return {
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": text
					},
					"value": text,
                    "url": url
				} for (text, url) in args
			]
		}

        
    def slack_post(self, text, blocks=None):
        return requests.post('https://slack.com/api/chat.postMessage', {
            'token': self.slack_token,
            'channel': self.slack_channel,
            'text': text,
            'icon_url': self.ICON_URL,
            'username': self.slack_username,
            'blocks': json.dumps(blocks) if blocks else None
        }).json()	