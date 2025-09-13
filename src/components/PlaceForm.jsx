import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import { useNavigate } from 'react-router-dom';

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
  const [submitError, setSubmitError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = (currentErrors, currentFormData) => {
    const requiredFields = ['name', 'surname', 'vk', 'tg', 'phone', 'program', 'group', 'course'];
    
    const hasFieldErrors = Object.keys(currentErrors).some(key => {
        return (requiredFields.includes(key) && currentErrors[key]) || key.startsWith('people_custom');
    });

    const allRequiredFieldsFilled = requiredFields.every(field => {
        const value = currentFormData[field];
        return value !== null && value !== undefined && value !== "";
    });

    setIsFormValid(allRequiredFieldsFilled && !hasFieldErrors);
  };


  const validateField = (field, value, currentFormData) => {
    const newErrors = { ...errors };
    const nameRegex = /^[А-ЯЁ][а-яё]+$/;
    const vkRegex = /^https?:\/\/(www\.)?vk\.com\/[a-zA-Z0-9._-]+$/; 
    const tgRegex = /^@?[a-zA-Z0-9_]{5,}$/; 
    const phoneRegex = /^(?:\+7|8)\d{10}$|^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/; 

    switch (field) {
      case 'name':
        if (!value) newErrors.name = "Обязательное поле";
        else if (!nameRegex.test(value)) newErrors.name = "Неверный формат";
        else delete newErrors.name;
        break;
      case 'surname':
        if (!value) newErrors.surname = "Обязательное поле";
        else if (!nameRegex.test(value)) newErrors.surname = "Неверный формат";
        else delete newErrors.surname;
        break;
      case 'middle_name':
        if (value && !nameRegex.test(value)) newErrors.middle_name = "Неверный формат";
        else delete newErrors.middle_name;
        break;
      case 'vk':
        if (!value) newErrors.vk = "Обязательное поле";
        else if (!vkRegex.test(value)) newErrors.vk = "Неверный формат";
        else delete newErrors.vk;
        break;
      case 'tg':
        if (!value) newErrors.tg = "Обязательное поле";
        else if (!tgRegex.test(value)) newErrors.tg = "Неверный формат";
        else delete newErrors.tg;
        break;
      case 'phone':
        if (!value) newErrors.phone = "Обязательное поле";
        else if (!phoneRegex.test(value)) newErrors.phone = "Неверный формат";
        else delete newErrors.phone;
        break;
      case 'program':
        if (!value) newErrors.program = "Обязательное поле";
        else delete newErrors.program;
        break;
      case 'group':
        if (!value) newErrors.group = "Обязательное поле";
        else delete newErrors.group;
        break;
      case 'course':
        if (!value) newErrors.course = "Обязательное поле";
        else delete newErrors.course;
        break;
      default:
        break;
    }

    currentFormData.people_custom.forEach((person, index) => {
      if (person && !/^[А-ЯЁа-яё\s-]+$/.test(person.trim())) { 
        newErrors[`people_custom[${index}]`] = "Неверный формат"; 
      } else {
        delete newErrors[`people_custom[${index}]`]; 
      }
    });

    setErrors(newErrors);
    validateForm(newErrors, currentFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData };

    if (name.startsWith("people_custom")) {
      const index = parseInt(name.split(/\[|\]/)[1]);
      const newPeople = [...formData.people_custom];
      newPeople[index] = value;
      newFormData.people_custom = newPeople;
    } else {
      newFormData[name] = value;
    }

    setFormData(newFormData);
    validateField(name, value, newFormData);
  };

  const handleAddPerson = () => {
    if (formData.people_custom.length < 3) {
      const newFormData = { ...formData, people_custom: [...formData.people_custom, ""] };
      setFormData(newFormData);
      validateForm(errors, newFormData);
    }
  };

  const handleRemovePerson = (index) => {
    const newPeople = [...formData.people_custom];
    newPeople.splice(index, 1);
    const newFormData = { ...formData, people_custom: newPeople };
    setFormData(newFormData);
    const newErrors = { ...errors };
    delete newErrors[`people_custom[${index}]`];
    setErrors(newErrors);
    validateForm(newErrors, newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (isFormValid) {
      try {
        const response = await fetch('/api/supabase/create_record/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            middle_name: formData.middle_name || null,
            course: parseInt(formData.course),
            people_custom: formData.people_custom.filter(p => p.trim() !== "")
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response:', data);
          navigate('/success'); 
        } else {
          if (response.status === 403) {
            setSubmitError("К сожалению, вы в черном списке.");
          } else {
            const data = await response.json();
            console.error('Ошибка:', data);
            if (data.phone) {
              setErrors({ ...errors, phone: 'Пользователь с таким номером уже зарегистрирован' });
            } else if (data.error) {
              setErrors({ ...errors, phone: 'Пользователь с таким номером не зарегистрирован' });
            } else {
              setSubmitError("Произошла ошибка при отправке формы.");
            }
          }
        }
      } catch (error) {
        console.error('Ошибка сети:', error);
        setSubmitError("Ошибка сети. Пожалуйста, проверьте ваше подключение.");
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
                style={{ borderColor: errors.surname ? '#FF673D' : (formData.surname ? 'white' : 'gray') }}
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
                style={{ borderColor: errors.name ? '#FF673D' : (formData.name ? 'white' : 'gray') }}
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
                style={{ borderColor: errors.middle_name ? '#FF673D' : (formData.middle_name ? 'white' : 'gray') }}
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
                style={{ borderColor: errors.vk ? '#FF673D' : (formData.vk ? 'white' : 'gray') }}
              />
              {errors.vk && <span className="error-message">{errors.vk}</span>}
            </div>
            <div>
              <label>Ник в Telegram</label>
              <input
                type="text"
                name="tg"
                value={formData.tg}
                onChange={handleChange}
                placeholder="@ivanov_tg"
                required
                style={{ borderColor: errors.tg ? '#FF673D' : (formData.tg ? 'white' : 'gray') }}
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
                  style={{ borderColor: errors.group ? '#FF673D' : (formData.group ? 'white' : 'gray') }}
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
                style={{ borderColor: errors.phone ? '#FF673D' : (formData.phone ? 'white' : 'gray') }}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
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
                style={{ borderColor: errors.program ? '#FF673D' : (formData.program ? 'white' : 'gray') }}
              />
              {errors.program && <span className="error-message">{errors.program}</span>}
            </div>
            <div>
              <label>С кем хочешь жить?</label>
              {formData.people_custom.map((person, index) => (
                <div key={index} className="person-input" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    name={`people_custom[${index}]`}
                    value={person}
                    onChange={handleChange}
                    placeholder={`Иванов Иван Иванович`}
                    style={{ borderColor: errors[`people_custom[${index}]`] ? '#FF673D' : 'gray', flexGrow: 1 }}
                  />
                  {formData.people_custom.length > 1 && ( 
                    <button type="button" className="remove-person" onClick={() => handleRemovePerson(index)}>
                      -
                    </button>
                  )}
                </div>
              ))}
              {formData.people_custom.length < 3 && (
                <div className='add'>
                  <p>Добавить человека</p>
                  <button type="button" className="add-person" onClick={handleAddPerson}>
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="submit-wrapper">
            {submitError && <span className="error" style={{ display: 'block', marginTop: '10px', position: 'absolute', fontSize: '24px' }}>{submitError}</span>}
            <button 
              type="submit"
              className="btnn"
              disabled={!isFormValid}
              style={{ 
                backgroundColor: isFormValid ? '#E7E2FF' : 'transparent',
                color: isFormValid ? 'black' : 'white',
                cursor: isFormValid ? 'pointer' : 'not-allowed'
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