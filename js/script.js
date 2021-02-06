'use strict';

(function () {

  const form = document.querySelector('#form');
  const inputFile = form.querySelector('#jsonFile');
  const newForm = document.querySelector('.addblock');
  const elementsFormTemplate = document.querySelector('#elementsForm');
  const checkboxFormTemplate = document.querySelector('#checkboxForm');
  const selectFormTemplate = document.querySelector('#selectForm');

  // загрузка json файла при клике //

  const loadbutton = document.querySelector('#load');
  loadbutton.addEventListener('click', () => {   //при клике добавляем форму для разметки и кнопку сброса
    addClassElement(newForm, 'addblock--show');
    createJsonFiles();  //функция добавления файла
  });

  // добавление json файла //
  function createJsonFiles() {
    let file = inputFile.files[0];
    let reader  = new FileReader();
    reader.onload = receivedText;
    reader.readAsText(file);

    function receivedText(e) { // обращение к элементу
      let forms = e.target.result;
      let newArr = JSON.parse(forms);
      let newArrLabel = Array.from(newArr.fields);
      newForm.innerHTML = '';
      createNewMaket(newForm, newArr.fields, newArrLabel);
      let newArrReferences = Array.from(newArr.references);
      createNewReferences(newForm, newArr.references, newArrReferences);
      createNewButton(newForm, newArr.buttons, newArr.buttons);
      addClassElement(newForm, 'addblock--show');

    }
  }


    // создаём label и Input //
    function createNewMaket(container, mak, content) {  //функция создаёт поле ввода и текстовое поле на форме
      mak.forEach (function (item, i) {
        item = document.createElement('div');   //создаём блок <div></div>
        item.classList.add('addblock__wrap');   // добавляем его в новую форму
        createElementsForm(item, content[i].label, content[i].input.type, content[i].input.required, content[i].input.placeholder, content[i].input.multiple, content[i].input.filetype, 
          content[i].input.mask, content[i].input.technologies, content[i].input.colors); // прописываем свойства элемента
        container.appendChild(item);            //отображение
      });
    }

    // создание и заполнение Label и Input//

    function createElementsForm(container, contentLabel, contentInputType, contentInputRequired, contentInputPlaceholder, contentInputMultiple, contentInputFiletype, contentInputMask, 
      contentTechnology, contentList) {
      var elementsForm = elementsFormTemplate.cloneNode(true).content.querySelector('div');   // обращаемся к #elementsForm и клонируем блок div
      elementsForm.querySelector('label').classList.add('addblock__label');                   //  добавляем label в форму
      elementsForm.querySelector('label').textContent = contentLabel;   
      elementsForm.querySelector('label').for = contentLabel;           
      elementsForm.querySelector('input').id = contentLabel;
      elementsForm.querySelector('input').type = contentInputType;
      if (elementsForm.querySelector('input').type === 'color') {
        elementsForm.querySelector('input').setAttribute('list', 'presetColors'); // если тип поля равен 'color', то добавляем список с id цветов
        let colors = document.createElement('datalist');
        colors.id = 'presetColors'
        contentList.forEach (function (item) {            //создаём коллекцию цветов
          let option = document.createElement('option');
          option.value = item;
          colors.appendChild(option);   //отображаем значения 'colors[]'
        });
        elementsForm.appendChild(colors);   //отображаем список с цветами
      }
      if (contentInputPlaceholder) {  //проверяем наличие ключа в объекте
        elementsForm.querySelector('input').placeholder = contentInputPlaceholder;
      }

      if (contentInputFiletype) {                                           
        let newArrFiletype = Array.from(contentInputFiletype);
        elementsForm.querySelector('input').accept = newArrFiletype;
        elementsForm.querySelector('input').multiple = contentInputMultiple;
      }
      if (contentInputMask) {
        elementsForm.querySelector('input').type = 'text';                    
        elementsForm.querySelector('input').placeholder = contentInputMask;
        jQuery(function($){
          $(elementsForm.querySelector('input')).mask(contentInputMask);
        });
      }
      if (contentInputType === 'technology') {                                  
        elementsForm.querySelector('input').classList.add('visually-hidden');
        createSelectForm(elementsForm, contentTechnology, contentInputMultiple);
      }
      elementsForm.querySelector('input').required = contentInputRequired;
      container.appendChild(elementsForm);
    }

    // создание и заполнение select//

    function createSelectForm (container, contentTechnology, contentInputMultiple) {
      let elementSelect = selectFormTemplate.cloneNode(true).content.querySelector('select');   // обращаемся к #selectForm и клонируем блок select
      elementSelect.classList.add('addblock__select');      //  добавляем select в форму
      elementSelect.multiple = contentInputMultiple;          
      let newArrTechnologies = Array.from(contentTechnology); 
      newArrTechnologies.forEach(function (item, i) {
        item = document.createElement('option');
        item.classList.add('addblock__option');
        item.textContent = newArrTechnologies[i];
        elementSelect.appendChild(item);
      });
      container.appendChild(elementSelect);
    }
    
    // создание и заполнение Checkbox//
    function createCheckboxForm(container, contentInputType, contentInputRequired, contentInputChecked) {   // обращаемся к #checkBoxForm и клонируем блок div
      var elementsForm = checkboxFormTemplate.cloneNode(true).content.querySelector('div');
      elementsForm.querySelector('input').type = contentInputType;      //  добавляем chbx в форму
      elementsForm.querySelector('input').required = contentInputRequired;    //  добавляем обязательное заполнение для chbx
      elementsForm.querySelector('input').checked = contentInputChecked;      //  добавляем статус chbx
      container.appendChild(elementsForm);    //  output
    }

    // создание и заполнение ссылок//
    function createReferencesForm(container, contentText, contentRef) {
      let elementsForm = document.createElement('a');   //создаём ссылку
      elementsForm.classList.add('addblock__ref');      //добавляем в форму
      elementsForm.textContent = contentText;           //присваиваем
      elementsForm.href = contentRef;
      container.appendChild(elementsForm);              //отображение
    }


    function createNewReferences(container, mak, content) {  ////функция создаёт ссылку на форме
              for (let i = 0; i < mak.length; i++) {
                let item = document.createElement('div'); // создаём блок для ссылки
                item.classList.add('addblock__wrap'); 
                if (content[i].input) {
                  item.classList.add('addblock__checkbox');   //создаём checkbox
                  createCheckboxForm(item, content[i].input.type, content[i].input.required, content[i].input.checked); // форма чекбокса и его параметры
                } else {
                  item.classList.add('addblock__link'); // добавляем ссылку
                  createReferencesForm(item, content[i].text, content[i].ref); // форма ссылки и её параметры
                }
                container.appendChild(item); // отображение
              };
            }

    function addClassElement (element, className) {        
      element.classList.add(className);
    }


           //отрисовка button //
    function createNewButton(container, button, content) { //функция создаёт кнопку на форме
      button.forEach (function (item, i) {
        item = document.createElement('button');  //создаём элемент <button></button>
        item.classList.add('addblock__button');   // добавляем его в новую форму
        item.textContent = content[i].text;       // получаем контент
        container.appendChild(item);              //отображение
      });
    }
})();