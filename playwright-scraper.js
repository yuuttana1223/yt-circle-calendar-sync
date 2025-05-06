const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the target page
  await page.goto("https://yt-circle.com/yt-circle-club/activity-schedules");

  // Wait for the script tag containing the data
  const events = await page.evaluate(() => {
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

  // Save the extracted data to a JSON file
  fs.writeFileSync("club-activities.json", JSON.stringify(events, null, 2));
  console.log("Event data saved to club-activities.json");

  await browser.close();
})();
