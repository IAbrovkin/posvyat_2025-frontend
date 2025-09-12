import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import { useNavigate, useLocation } from 'react-router-dom';

const PlaceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    middle_name: "",
    vk: "",
    tg: "",
    phone: "",
    program: "",
    group: "",
    course: 1,
    people_custom: [""]
  });
  const navigate = useNavigate();
  
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    const nameRegex = /^[А-ЯЁ][а-яё]+$/;
    const vkRegex = /^https?:\/\/(www\.)?vk\.com\/[a-zA-Z0-9._-]+$/; 
    const tgRegex = /^@?[a-zA-Z0-9_]{5,}$/; 
    const phoneRegex = /^(?:\+7|8)\d{10}$|^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/; 

    switch (field) {
      case 'name':
        if (!value) {
          newErrors.name = "Обязательное поле";
        } else if (!nameRegex.test(value)) {
          newErrors.name = "Неверный формат";
        } else {
          delete newErrors.name;
        }
        break;
      case 'surname':
        if (!value) {
          newErrors.surname = "Обязательное поле";
        } else if (!nameRegex.test(value)) {
          newErrors.surname = "Неверный формат";
        } else {
          delete newErrors.surname;
        }
        break;
      case 'middle_name':
        if (value && !nameRegex.test(value)) {
          newErrors.middle_name = "Неверный формат";
        } else {
          delete newErrors.middle_name;
        }
        break;
      case 'vk':
        if (!value) {
          newErrors.vk = "Обязательное поле";
        } else if (!vkRegex.test(value)) {
          newErrors.vk = "Неверный формат";
        } else {
          delete newErrors.vk;
        }
        break;
      case 'tg':
        if (!value) {
          newErrors.tg = "Обязательное поле";
        } else if (!tgRegex.test(value)) {
          newErrors.tg = "Неверный формат";
        } else {
          delete newErrors.tg;
        }
        break;
      case 'phone':
        if (!value) {
          newErrors.phone = "Обязательное поле";
          delete newErrors.phoneExists;
        } else if (!phoneRegex.test(value)) {
          newErrors.phone = "Неверный формат";
          delete newErrors.phoneExists;
        } else {
          delete newErrors.phone;
        }
        break;
      case 'program':
        if (!value) {
          newErrors.program = "Обязательное поле";
        } else {
          delete newErrors.program;
        }
        break;
      case 'group':
        if (!value) {
          newErrors.group = "Обязательное поле";
        } else {
          delete newErrors.group;
        }
        break;
      case 'course':
        if (!value) {
          newErrors.course = "Обязательное поле";
        } else {
          delete newErrors.course;
        }
        break;
      default:
        break;
    }

    formData.people_custom.forEach((person, index) => {
      if (person && !person.trim()) {
        newErrors[`people_custom[${index}]`] = "Неверный формат"; 
      } else {
        delete newErrors[`people_custom[${index}]`]; 
      }
    });

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("people_custom")) {
      const index = parseInt(name.split("[")[1]);
      const newPeople = [...formData.people_custom];
      newPeople[index] = value;
      setFormData({ ...formData, people_custom: newPeople });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    validateField(name, value);
  };

  const handleAddPerson = () => {
    setFormData({ ...formData, people_custom: [...formData.people_custom, ""] });
  };

  const handleRemovePerson = (index) => {
    const newPeople = [...formData.people_custom];
    newPeople.splice(index, 1);
    setFormData({ ...formData, people_custom: newPeople });
    validateField(`people_custom[${index}]`, ""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const response = await fetch('api/v1/resettlement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            surname: formData.surname,
            middle_name: formData.middle_name || null,
            vk: formData.vk,
            tg: formData.tg,
            phone: formData.phone,
            program: formData.program,
            group: formData.group,
            course: parseInt(formData.course),
            people_custom: formData.people_custom
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Response:', data);
          navigate('/castes');
        } else {
          console.error('Ошибка:', data);
          if (data.phone) {
            setErrors({ ...errors, phoneExists: 'Пользователь с таким номером уже зарегистрирован' });
          } else if (data.error) {
            setErrors({ ...errors, phoneExists: 'Пользователь с таким номером не зарегистрирован' });
          }
        }
      } catch (error) {
        console.error('Ошибка сети:', error);
      }
    }
  };

  return (
    <div className="place-background">
    <div className="registration">
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="head-title">Расселение</div>
        <div className="form-grid">
          <div>
            <label>Фамилия</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Иванов"
              required
              style={{ borderColor: errors.surname ? '#FF673D' : 'gray' }}
            />
            {errors.surname && <span className="error-message">{errors.surname}</span>}
          </div>
          <div>
            <label>Имя</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Иван"
              required
              style={{ borderColor: errors.name ? '#FF673D' : 'gray' }}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div>
            <label>Отчество (при наличии)</label>
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              placeholder="Иванович"
              style={{ borderColor: errors.middle_name ? '#FF673D' : 'gray' }}
            />
            {errors.middle_name && <span className="error-message">{errors.middle_name}</span>}
          </div>
          <div>
            <label>Ссылка на VK</label>
            <input
              type="text"
              name="vk"
              value={formData.vk}
              onChange={handleChange}
              placeholder={window.innerWidth <= 768 ? "https://vk.com/ivan" : "https://vk.com/ivanov_vk"}
              required
              style={{ borderColor: errors.vk ? '#FF673D' : 'gray' }}
            />
            {errors.vk && <span className="error-message">{errors.vk}</span>}
          </div>
          <div>
            <label>Ссылка на tg</label>
            <input
              type="text"
              name="tg"
              value={formData.tg}
              onChange={handleChange}
              placeholder="@ivanov_tg"
              required
              style={{ borderColor: errors.tg ? '#FF673D' : 'gray' }}
            />
            {errors.tg && <span className="error-message">{errors.tg}</span>}
          </div>
          <div className='form-grid-item'>
            <div className='form-grid-item-1'>
              <label>Курс</label>
              <CustomSelect
                name="course"
                value={formData.course}
                onChange={handleChange}
                options={[
                  { value: 1, label: '1 (бак. / спец.)' },
                  { value: 2, label: '2 (бак. / спец.)' },
                  { value: 3, label: '3 (бак. / спец.)' },
                  { value: 4, label: '4 (бак. / спец.)' },
                  { value: 5, label: '5 (бак. / спец.)' },
                  { value: 6, label: '1 (магистратура)' },
                  { value: 7, label: '2 (магистратура)' },
                ]}
              />
            </div>
            <div className='form-grid-item-2'>
              <label>Группа</label>
              <input
                type="text"
                name="group"
                value={formData.group}
                onChange={handleChange}
                placeholder="БИВ203"
                required
                style={{ borderColor: errors.group ? '#FF673D' : 'gray' }}
              />
            </div>
          </div>
        </div>
        <div className='form-grid-two'>
          <div>
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7(900)777-14-88"
              required
              style={{ borderColor: errors.phone ? '#FF673D' : 'gray' }}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
            {errors.phoneExists && <span className="error">{errors.phoneExists}</span>}
          </div>
          <div>
            <label>Образовательная программа</label>
            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChange}
              placeholder={window.innerWidth <= 768 ? "ИВТ" : "Информатика и вычислительная техника"}
              required
              style={{ borderColor: errors.program ? '#FF673D' : 'gray' }}
            />
            {errors.program && <span className="error-message">{errors.program}</span>}
          </div>
          <div>
            <label>С кем хочешь жить?</label>
            {formData.people_custom.map((person, index) => (
              <div key={index} className="person-input" style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  name={`people_custom[${index}]`}
                  value={person}
                  onChange={handleChange}
                  placeholder={`Иванов Иван Иванович`}
                  style={{ borderColor: errors[`people_custom[${index}]`] ? '#FF673D' : 'gray', marginRight: '5px' }}
                />
                {index === 0 && formData.people_custom.length > 1 && ( 
                  <button type="button" className="remove-person" onClick={() => handleRemovePerson(index)}>
                    -
                  </button>
                )}
              </div>
            ))}
            {formData.people_custom.length < 3 && (
              <div className='add'>
                <p>Добавить человека</p>
                <button type="button" className="add-person" onClick={handleAddPerson} style={{ marginRight: '5px' }}>
                  +
                </button>
              </div>
            )}
          </div>
        </div>
          <div className="submit-wrapper">
            <button 
              type="submit"
              className="btnn"
              style={{ 
                backgroundColor: isFormValid ? '#E7E2FF' : 'transparent',
                color: isFormValid ? 'black' : 'white'
              }}
            >
              Отправить
            </button>
          </div>
      </form>
    </div>
    </div>
  );
};

export default PlaceForm;