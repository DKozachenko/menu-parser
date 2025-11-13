const ALL_TEXT_REGEXP = /.*([А-Я]{1}[А-Яа-яё «»,\/\-\(\)\/]+)\n([И|и])ли\n.*([А-Я]{1}[А-Яа-яё «»,\/\-\(\)\/]+)/gm;
const OPTIONS_REGEXP = /.*(?<firstDish>[А-Я]{1}[А-Яа-яё «»,\/\-\(\)\/]+)\n([И|и])ли\n.*(?<secondDish>[А-Я]{1}[А-Яа-яё «»,\/\-\(\)\/]+)/;

const MONDAY_KEY = 'monday';
const TUESDAY_KEY = 'tuesday';
const WEDNESDAY_KEY = 'wednesday';
const THURSDAY_KEY = 'thursday';
const FRIDAY_KEY = 'friday';
const SATURDAY_KEY = 'saturday';
const SUNDAY_KEY = 'sunday';

const DAY_LABEL_MAP = {
  [MONDAY_KEY]: 'Понедельник',
  [TUESDAY_KEY]: 'Вторник',
  [WEDNESDAY_KEY]: 'Среда',
  [THURSDAY_KEY]: 'Четверг',
  [FRIDAY_KEY]: 'Пятница',
  [SATURDAY_KEY]: 'Суббота',
  [SUNDAY_KEY]: 'Воскресенье'
};

const BREAKFAST_KEY = 'breakfast';
const LUNCH_KEY = 'lunch';
const DINNER_KEY = 'dinner';

const MEAL_LABEL_MAP = {
  [BREAKFAST_KEY]: 'Завтрак',
  [LUNCH_KEY]: 'Обед',
  [DINNER_KEY]: 'Ужин'
}

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

  setSecondStep(menu);
}

function parseMenu(match) {
  const menu = {
    [MONDAY_KEY]: {},
    [TUESDAY_KEY]: {},
    [WEDNESDAY_KEY]: {},
    [THURSDAY_KEY]: {},
    [FRIDAY_KEY]: {},
    [SATURDAY_KEY]: {}
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

function setSecondStep(menu) {
  const flowStepBlock = document.querySelector('.flow-step');
  flowStepBlock.innerHTML = `
    <div class="handled-block">
      <p>Меню успешно обработано!</p>

      <div class="checkbox">
        <input type="checkbox" id="include-sunday" checked />
        <label for="include-sunday">Добавить воскресенье для выбора</label>
      </div>

      <button class="button" type="button">Начать выбор</button>
    </div>
  `;

  const button = document.querySelector('.button');
  button.addEventListener('click', () => {
    const includeSundayCheckbox = document.querySelector('#include-sunday');
    setThirdStep(menu, includeSundayCheckbox.checked);
  })
}

function setThirdStep(menu, includeSunday) {
  const flowStepBlock = document.querySelector('.flow-step');
  flowStepBlock.innerHTML = `
    <form class="form">
      ${buildDayFieldset(MONDAY_KEY, menu, MONDAY_KEY, TUESDAY_KEY)}

      ${buildDayFieldset(TUESDAY_KEY, menu, MONDAY_KEY, TUESDAY_KEY)}

      ${buildDayFieldset(WEDNESDAY_KEY, menu, WEDNESDAY_KEY, THURSDAY_KEY)}

      ${buildDayFieldset(THURSDAY_KEY, menu, WEDNESDAY_KEY, THURSDAY_KEY)}

      ${buildDayFieldset(FRIDAY_KEY, menu, FRIDAY_KEY, SATURDAY_KEY)}

      ${buildDayFieldset(SATURDAY_KEY, menu, FRIDAY_KEY, SATURDAY_KEY)}

      ${includeSunday ? buildDayFieldset(SUNDAY_KEY, menu, FRIDAY_KEY, SATURDAY_KEY) : ''}

      <button class="button form-button" type="submit">Сформировать</button>
    </form>
  `;

  const addMealsButtons = document.querySelectorAll('.add-meals');
  addMealsButtons.forEach(button => {
    button.addEventListener('click', (event) => addMeals(event.target, menu));
  });

  const formButton = document.querySelector('.form-button');
  formButton.addEventListener('click', (event) => {
    event.preventDefault();
    setFourthStep(menu, includeSunday);
  });
}

function buildMealFieldset(dayKey, mealKey, menu, day1ForChoose, day2ForChoose) {
  return `
    <fieldset class="meal-fieldset">
      <legend>${MEAL_LABEL_MAP[mealKey]}</legend>

      <div>
        <input type="radio" name="${dayKey}-${mealKey}" id="${dayKey}-${day1ForChoose}-${mealKey}-1" value="${menu[day1ForChoose][mealKey].firstOption}" />
        <label for="${dayKey}-${day1ForChoose}-${mealKey}-1">${menu[day1ForChoose][mealKey].firstOption}</label>
      </div>

      <div>
        <input type="radio" name="${dayKey}-${mealKey}" id="${dayKey}-${day1ForChoose}-${mealKey}-2" value="${menu[day1ForChoose][mealKey].secondOption}" />
        <label for="${dayKey}-${day1ForChoose}-${mealKey}-2">${menu[day1ForChoose][mealKey].secondOption}</label>
      </div>

      <div>
        <input type="radio" name="${dayKey}-${mealKey}" id="${dayKey}-${day2ForChoose}-${mealKey}-1" value="${menu[day2ForChoose][mealKey].firstOption}" />
        <label for="${dayKey}-${day2ForChoose}-${mealKey}-1">${menu[day2ForChoose][mealKey].firstOption}</label>
      </div>

      <div>
        <input type="radio" name="${dayKey}-${mealKey}" id="${dayKey}-${day2ForChoose}-${mealKey}-2" value="${menu[day2ForChoose][mealKey].secondOption}" />
        <label for="${dayKey}-${day2ForChoose}-${mealKey}-2">${menu[day2ForChoose][mealKey].secondOption}</label>
      </div>

      ${mealKey === BREAKFAST_KEY 
        ? '' 
        : mealKey === LUNCH_KEY 
          ? `<button class="button add-meals" type="button" data-day-key="${dayKey}" data-meal-key="${mealKey}">+блюда с ужина</button>`
          : `<button class="button add-meals" type="button" data-day-key="${dayKey}" data-meal-key="${mealKey}">+блюда с обеда</button>`}
    </fieldset>
  `;
}

function buildDayFieldset(dayKey, menu, day1ForChoose, day2ForChoose) {
  return `
    <fieldset class="day-fieldset">
      <legend>${DAY_LABEL_MAP[dayKey]}</legend>

      ${this.buildMealFieldset(dayKey, BREAKFAST_KEY, menu, day1ForChoose, day2ForChoose)}

      ${this.buildMealFieldset(dayKey, LUNCH_KEY, menu, day1ForChoose, day2ForChoose)}

      ${this.buildMealFieldset(dayKey, DINNER_KEY, menu, day1ForChoose, day2ForChoose)}
    </fieldset>
  `;
}

function setFourthStep(menu, includeSunday) {
  const form = document.querySelector('form');
  const formData = new FormData(form);
  const formValue = Object.fromEntries(formData.entries());

  let validKeysLength = includeSunday ? 3 * 7 : 3 * 6;
  if (Object.keys(formValue).length !== validKeysLength) {
    return;
  }

  const mondayTuesdayMeals = [
    formValue[`${MONDAY_KEY}-${BREAKFAST_KEY}`], formValue[`${MONDAY_KEY}-${LUNCH_KEY}`], formValue[`${MONDAY_KEY}-${DINNER_KEY}`],
    formValue[`${TUESDAY_KEY}-${BREAKFAST_KEY}`], formValue[`${TUESDAY_KEY}-${LUNCH_KEY}`], formValue[`${TUESDAY_KEY}-${DINNER_KEY}`],
  ];

  const wednesdayThursdayMeals = [
    formValue[`${WEDNESDAY_KEY}-${BREAKFAST_KEY}`], formValue[`${WEDNESDAY_KEY}-${LUNCH_KEY}`], formValue[`${WEDNESDAY_KEY}-${DINNER_KEY}`],
    formValue[`${THURSDAY_KEY}-${BREAKFAST_KEY}`], formValue[`${THURSDAY_KEY}-${LUNCH_KEY}`], formValue[`${THURSDAY_KEY}-${DINNER_KEY}`],
  ];

  const lastDayMeals = [
    formValue[`${FRIDAY_KEY}-${BREAKFAST_KEY}`], formValue[`${FRIDAY_KEY}-${LUNCH_KEY}`], formValue[`${FRIDAY_KEY}-${DINNER_KEY}`],
    formValue[`${SATURDAY_KEY}-${BREAKFAST_KEY}`], formValue[`${SATURDAY_KEY}-${LUNCH_KEY}`], formValue[`${SATURDAY_KEY}-${DINNER_KEY}`],
  ];

  if (includeSunday) {
    lastDayMeals.push(formValue[`${SUNDAY_KEY}-${BREAKFAST_KEY}`], formValue[`${SUNDAY_KEY}-${LUNCH_KEY}`], formValue[`${SUNDAY_KEY}-${DINNER_KEY}`]);
  }

  const mondayTuesdayMealsDistribution = getMealsDistributionWithCount(mondayTuesdayMeals);
  const wednesdayThursdayMealsDistribution = getMealsDistributionWithCount(wednesdayThursdayMeals);
  const lastDayMealsDistribution = getMealsDistributionWithCount(lastDayMeals);

  const flowStepBlock = document.querySelector('.flow-step');
  flowStepBlock.innerHTML = `
    <p class="result-text">
      <strong>Пн+Вт:</strong><br/><br/>

      ${buildMealsWithCount(mondayTuesdayMealsDistribution)}<br/>

      <strong>Ср+Чт:</strong><br/><br/>

      ${buildMealsWithCount(wednesdayThursdayMealsDistribution)}<br/>

      <strong>Пт+Сб${includeSunday ? '+Вс' : ''}:</strong><br/><br/>

      ${buildMealsWithCount(lastDayMealsDistribution)}
    </p>
  `;

}

function getMealsDistributionWithCount(meals) {
  const result = {};

  meals.forEach(meal => {
    if (result[meal] === undefined) {
      result[meal] = 0;
    }

    ++result[meal];
  });

  return result;
}

function buildMealsWithCount(mealsDistribution) {
  return `
    ${Object.entries(mealsDistribution).map(([meal, count]) => `${meal} x${count}<br/>`).join('')}
  `;
}

function addMeals(button, menu) {
  const { dayKey, mealKey } = button.dataset;
  
  let neededDays = [];
  if (dayKey === MONDAY_KEY || dayKey === TUESDAY_KEY) {
    neededDays = [menu[MONDAY_KEY], menu[TUESDAY_KEY]];
  }

  if (dayKey === WEDNESDAY_KEY || dayKey === THURSDAY_KEY) {
    neededDays = [menu[WEDNESDAY_KEY], menu[THURSDAY_KEY]];
  }

  if (dayKey === FRIDAY_KEY || dayKey === SATURDAY_KEY || dayKey === SUNDAY_KEY) {
    neededDays = [menu[FRIDAY_KEY], menu[SATURDAY_KEY]];
  }

  const optionsToAdd = mealKey === LUNCH_KEY 
    ? neededDays.map((dayMenu) => [dayMenu[DINNER_KEY].firstOption, dayMenu[DINNER_KEY].secondOption]).flat()
    : neededDays.map((dayMenu) => [dayMenu[LUNCH_KEY].firstOption, dayMenu[LUNCH_KEY].secondOption]).flat();


  optionsToAdd.forEach((addedMeal, index) => {
    const div = document.createElement('div');

    div.innerHTML = `
      <input type="radio" name="${dayKey}-${mealKey}" id="${dayKey}-${dayKey}-${mealKey}-${3 + index}" value="${addedMeal}" />
      <label for="${dayKey}-${dayKey}-${mealKey}-${3 + index}">${addedMeal}</label>
    `;

    button.before(div);
  });

  button.disabled = true;
}