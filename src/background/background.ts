/// <reference types="chrome"/>

type Problem = {
  revised?: boolean;
  nextReviewDate?: string;
};

const MORNING_HOUR = 9;
const EVENING_HOUR = 19;

async function notifyDueProblems() {

  const result =
    await chrome.storage.local.get(
      "savedProblems"
    );

  const problems =
    (result.savedProblems || []) as Problem[];

  const now =
    new Date();

  const dueProblems =
    problems.filter(
      (p) =>

        !p.revised &&

        p.nextReviewDate &&

        new Date(
          p.nextReviewDate
        ) <= now
    );

  if (
    dueProblems.length === 0
  ) {
    return;
  }

  chrome.notifications.create({
    type: "basic",

    iconUrl:
      chrome.runtime.getURL(
        "icon.png"
      ),

    title:
      "🔁 ReLeet Reminder",

    message:
      `You have ${dueProblems.length} problem` +

      (
        dueProblems.length > 1
          ? "s"
          : ""
      ) +

      " due today. Open ReLeet and review them.",
  });
}

async function checkDueProblems() {

  const result =
    await chrome.storage.local.get([
      "savedProblems",
      "lastMorningReminder",
      "lastEveningReminder"
    ]);

  const problems =
    (result.savedProblems || []) as Problem[];

  const now =
    new Date();

  const dueProblems =
    problems.filter(
      (p) =>

        !p.revised &&

        p.nextReviewDate &&

        new Date(
          p.nextReviewDate
        ) <= now
    );

  if (
    dueProblems.length === 0
  ) {
    return;
  }

  const today =
    now.toDateString();

  const hour =
    now.getHours();

  const isMorning =
    hour === MORNING_HOUR;

  const isEvening =
    hour === EVENING_HOUR;

  if (
    !isMorning &&
    !isEvening
  ) {
    return;
  }

  if (
    isMorning &&
    result.lastMorningReminder === today
  ) {
    return;
  }

  if (
    isEvening &&
    result.lastEveningReminder === today
  ) {
    return;
  }

  await notifyDueProblems();

  if (isMorning) {

    await chrome.storage.local.set({
      lastMorningReminder:
        today,
    });

  }

  if (isEvening) {

    await chrome.storage.local.set({
      lastEveningReminder:
        today,
    });

  }

}

chrome.runtime.onInstalled.addListener(
  async () => {

    chrome.alarms.create(
      "revisionCheck",
      {
        periodInMinutes: 30
      }
    );

    await notifyDueProblems();

  }
);

chrome.runtime.onStartup.addListener(
  async () => {

    chrome.alarms.create(
      "revisionCheck",
      {
        periodInMinutes: 30
      }
    );

    await notifyDueProblems();

  }
);

chrome.alarms.onAlarm.addListener(
  async (alarm) => {

    if (
      alarm.name !==
      "revisionCheck"
    ) {
      return;
    }

    await checkDueProblems();

  }
);

chrome.notifications.onClicked.addListener(
  () => {

    chrome.runtime.openOptionsPage();

  }
);