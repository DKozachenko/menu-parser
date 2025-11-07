const ALL_TEXT_REGEXP = /.*([А-Я]{1}[А-Яа-яё «»,\/-]+)\nили\n.*([А-Я]{1}[А-Яа-яё «»,\/-]+)/gm;
const OPTIONS_REGEXP = /.*(?<firstDish>[А-Я]{1}[А-Яа-яё «»,\/-]+)\nили\n.*(?<secondDish>[А-Я]{1}[А-Яа-яё «»,\/-]+)/;

const MONDAY_KEY = 'monday';
const TUESDAY_KEY = 'tuesday';
const WEDNESDAY_KEY = 'wednesday';
const THURSDAY_KEY = 'thursday';
const FRIDAY_KEY = 'friday';
const SATURDAY_KEY = 'saturday';

const BREAKFAST_KEY = 'breakfast';
const LUNCH_KEY = 'lunch';
const DINNER_KEY = 'dinner';

const textTextarea = document.querySelector('#text');
textTextarea.addEventListener('paste', onPasteText);

function onPasteText(event) {
  const pastedText = event.clipboardData.getData('text');

  const match = pastedText.match(ALL_TEXT_REGEXP);

  if (!match || match.length !== 18) {
    return;
  }

  const menu = parseMenu(match);
  if (!isMenuValid(menu)) {
    console.error('Меню распарсилось некорректно, объект:', menu);
    return;
  }

  setSecondStep();
}

function setFirstStep(menu) {

}

function parseMenu(match) {
  const menu = {
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
    saturday: {}
  };

  const INDEX_MENU_KEY_MAP = {
    0: [MONDAY_KEY, BREAKFAST_KEY],
    1: [MONDAY_KEY, LUNCH_KEY],
    2: [MONDAY_KEY, DINNER_KEY],
    3: [TUESDAY_KEY, BREAKFAST_KEY],
    4: [TUESDAY_KEY, LUNCH_KEY],
    5: [TUESDAY_KEY, DINNER_KEY],
    6: [WEDNESDAY_KEY, BREAKFAST_KEY],
    7: [WEDNESDAY_KEY, LUNCH_KEY],
    8: [WEDNESDAY_KEY, DINNER_KEY],
    9: [THURSDAY_KEY, BREAKFAST_KEY],
    10: [THURSDAY_KEY, LUNCH_KEY],
    11: [THURSDAY_KEY, DINNER_KEY],
    12: [FRIDAY_KEY, BREAKFAST_KEY],
    13: [FRIDAY_KEY, LUNCH_KEY],
    14: [FRIDAY_KEY, DINNER_KEY],
    15: [SATURDAY_KEY, BREAKFAST_KEY],
    16: [SATURDAY_KEY, LUNCH_KEY],
    17: [SATURDAY_KEY, DINNER_KEY],
  }

  match.forEach((matchGroup, index) => {
    const firstOption = matchGroup.match(OPTIONS_REGEXP)?.groups?.['firstDish'] ?? null;
    const secondOption = matchGroup.match(OPTIONS_REGEXP)?.groups?.['secondDish'] ?? null;

    const [firstLevelKey, secondLevelKey] = INDEX_MENU_KEY_MAP[index];
    menu[firstLevelKey][secondLevelKey] = {
      firstOption,
      secondOption,
    }
  });

  return menu;
}

function isMenuValid(menu) {
  return hasNoNulls(menu);
}

function hasNoNulls(obj) {
  if (obj === null || obj === undefined || obj === '') {
    return false;
  }

  if (typeof obj === 'object' && Object.keys(obj).length === 0) {
    return false;
  }
  
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!hasNoNulls(obj[key])) {
          return false;
        }
      }
    }
  }
  
  return true;
}

function setSecondStep() {

}