from apscheduler.schedulers.blocking import BlockingScheduler
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import requests, bs4, re, time
from shutil import copyfile
import filecmp
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.action_chains import ActionChains
from airtable import Airtable
from datetime import datetime, timedelta


def some_job():
	my_date = datetime.now() + timedelta(hours=5)
	zip_codes = []
	location_names = []
	airtable = Airtable('applrO42eyJ3rUQyb', 'MaVaccSites_Today', process.env.AIRTABLE_API_KEY)
	records = airtable.get_all(view='Walgreens')
	for r in records:
		fields = r['fields']
		zip_codes.append(fields['Full Address'])
		location_names.append(fields['Location Name'])



	driver = webdriver.Chrome(executable_path = 'C:/Users/zstil/Downloads/chromedriver_win32/chromedriver.exe')
	driver.get("https://www.walgreens.com/findcare/vaccination/covid-19/appointment/screening/results-eligible/")
	time.sleep(10)



	items = driver.find_elements_by_xpath("//*[@id='user_name']")
	item = items[0]
	item.send_keys("zzany1@gmail.com")


	items = driver.find_elements_by_xpath("//*[@id='user_password']")
	item = items[0]
	item.send_keys("testing123!")

	python_button = driver.find_elements_by_xpath("//*[@id='submit_btn']")[0]
	python_button.click()
	time.sleep(30)

	items = driver.find_elements_by_xpath("//*[@class='sv_q_radiogroup_control_item sv_q_radiogroup_label1']")
	curr = items[0]
	actions = ActionChains(driver)
	actions.move_to_element(curr)
	actions.click(curr)
	actions.perform()


	curr = items[3]
	actions = ActionChains(driver)
	actions.move_to_element(curr)
	actions.click(curr)
	actions.perform()

	curr = items[5]
	actions = ActionChains(driver)
	actions.move_to_element(curr)
	actions.click(curr)
	actions.perform()

	curr = items[7]
	actions = ActionChains(driver)
	actions.move_to_element(curr)
	actions.click(curr)
	actions.perform()

	curr = items[9]
	actions = ActionChains(driver)
	actions.move_to_element(curr)
	actions.click(curr)
	actions.perform()

	python_button = driver.find_elements_by_xpath("//*[@class=' sv_complete_btn']")[0]
	python_button.click()
	time.sleep(5)

	python_button = driver.find_elements_by_xpath("//*[@class='btn btn__blue button-agree']")[0]
	python_button.click()
	time.sleep(5)

	items = driver.find_elements_by_xpath("//*[@class='btn__radio']")
	curr = items[0]
	actions = ActionChains(driver)
	actions.move_to_element(curr)
	actions.click(curr)
	actions.perform()

	python_button = driver.find_elements_by_xpath("//*[@id='continueBtn']")[0]
	python_button.click()
	time.sleep(10)


	for n in range(len(zip_codes)):
		items = driver.find_elements_by_xpath("//*[@id='search-address']")
		item = items[0]
		zip_code = zip_codes[n]
		item.clear()
		item.send_keys(zip_code)
		item.send_keys(Keys.DOWN)
		time.sleep(1)
		item.send_keys(Keys.DOWN)
		item.send_keys(Keys.ENTER)
		time.sleep(5)

		items = driver.find_elements_by_xpath("//*[contains(text(), 'coming up within')]")

		availabilty_time = driver.find_elements_by_xpath("//*[@class='pull-left address-wrapper']")
		if len(availabilty_time) < 1:
			print("Nothing at: " + zip_code)
			record = airtable.match('Location Name', location_names[n])
			fields = {'Availability': 'None', 'Last Updated': my_date.isoformat()}
			airtable.update(record['id'], fields)
		elif (len(items) > 0):
			print("Nothing at: " + zip_code)
			record = airtable.match('Location Name', location_names[n])
			fields = {'Availability': 'None', 'Last Updated': my_date.isoformat()}
			airtable.update(record['id'], fields)
		elif (zip_code[0:3] in driver.find_elements_by_xpath("//*[@class='pull-left address-wrapper']")[0].text):
			dates = driver.find_elements_by_xpath("//*[@class='text-center']")[0].text
			available_name = driver.find_elements_by_xpath("//*[@style='color: green; font-weight: bold;']")
			a = available_name[0].text
			a = a[0:a.find('e')+1]
			slot = dates + ': ' + a
			while len(driver.find_elements_by_xpath("//*[@class='nextDate ']")) > len(driver.find_elements_by_xpath("//*[@class='nextDate backDateDisabled']")):
				try:
					python_button = driver.find_elements_by_xpath("//*[@class='nextDate ']")[0]
					python_button.click()
					time.sleep(5)
					newdates = '\n' + driver.find_elements_by_xpath("//*[@class='text-center']")[0].text
					available_name = driver.find_elements_by_xpath("//*[@style='color: green; font-weight: bold;']")
					b = available_name[0].text
					b = b[0:b.find('e')+1]
					slot +=  newdates + ': ' + b
				except:
					print("weird error")
					break
			record = airtable.match('Location Name', location_names[n])
			fields = {'Availability': slot, 'Last Updated': my_date.isoformat()}
			airtable.update(record['id'], fields)
		else:
			print("Nothing at: " + zip_code)
			record = airtable.match('Location Name', location_names[n])
			fields = {'Availability': 'None', 'Last Updated': my_date.isoformat()}
			airtable.update(record['id'], fields)


scheduler = BlockingScheduler()
scheduler.add_job(some_job, 'interval', minutes=30)
scheduler.start()
