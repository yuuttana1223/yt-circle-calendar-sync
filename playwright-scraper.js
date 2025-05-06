const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Scrape club activities
  await page.goto("https://yt-circle.com/yt-circle-club/activity-schedules");
  const clubEvents = await page.evaluate(() => {
    const titles = Array.from(
      document.querySelectorAll(".notion-page-title-text")
    ).map((el) => el.textContent.trim());
    const dates = Array.from(
      document.querySelectorAll(".notion-property-date-item")
    ).map((el) => el.textContent.trim());
    const links = Array.from(
      document.querySelectorAll(
        ".notion-collection-card.notion-collection-card-size-medium"
      )
    ).map((el) => el.href);

    return titles.map((title, index) => ({
      title,
      date: dates[index] || "No date available",
      url: links[index] || "No URL available",
    }));
  });
  fs.writeFileSync("club-activities.json", JSON.stringify(clubEvents, null, 2));
  console.log("Club activities saved to club-activities.json");

  // Scrape general activities
  await page.goto("https://yt-circle.com/activity-schedules");
  const generalEvents = await page.evaluate(() => {
    const titles = Array.from(
      document.querySelectorAll(".notion-page-title-text")
    ).map((el) => el.textContent.trim());
    const dates = Array.from(
      document.querySelectorAll(".notion-property-date-item")
    ).map((el) => el.textContent.trim());
    const links = Array.from(
      document.querySelectorAll(
        ".notion-collection-card.notion-collection-card-size-medium"
      )
    ).map((el) => el.href);

    return titles.map((title, index) => ({
      title,
      date: dates[index] || "No date available",
      url: links[index] || "No URL available",
    }));
  });
  fs.writeFileSync(
    "general-activities.json",
    JSON.stringify(generalEvents, null, 2)
  );
  console.log("General activities saved to general-activities.json");

  await browser.close();
})();
