import os
import time
from pathlib import Path

import chromedriver_autoinstaller
from instascrape import Profile
from selenium import webdriver


def required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"{name} must be configured")
    return value


username = os.getenv("INSTAGRAM_USERNAME", "kazakh_inform")
output_path = Path(
    os.getenv("INSTAGRAM_OUTPUT_PATH", str(Path(__file__).with_name("data.json"))),
).expanduser()
session_cookies = {
    name: required_env(name)
    for name in (
        "INSTAGRAM_SESSIONID",
        "INSTAGRAM_DS_USER_ID",
        "INSTAGRAM_MID",
        "INSTAGRAM_DATR",
    )
}

chromedriver_autoinstaller.install()
driver = webdriver.Chrome()

try:
    driver.get(url=f"https://www.instagram.com/{username}/")
    for name, value in session_cookies.items():
        cookie_name = name.replace("INSTAGRAM_", "", 1).lower()
        driver.add_cookie({"name": cookie_name, "value": value})

    profile = Profile(f"https://www.instagram.com/{username}/")
    profile.scrape(webdriver=driver)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    profile.to_json(str(output_path))

    for post in profile.get_posts(driver):
        print(f"Caption: {post.caption}")
        print(f"Image URL: {post.display_url}")
        print(f"Post Link: https://www.instagram.com/p/{post.shortcode}/")
        print("-" * 50)
        time.sleep(1)
finally:
    driver.quit()
