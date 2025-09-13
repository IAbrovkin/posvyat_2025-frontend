import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import { useNavigate } from 'react-router-dom';

const PlaceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    parname: "",
    vk_link: "",
    tg_link: "",
    phone_number: "",
    education_program: "",
    group: "",
    course: 1,
    people_custom: [""]
  });
  const navigate = useNavigate();
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = (currentErrors, currentFormData) => {
    const requiredFields = ['name', 'surname', 'vk_link', 'tg_link', 'phone_number', 'education_program', 'group', 'course'];
    
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
    const vk_linkRegex = /^https?:\/\/(www\.)?vk_link\.com\/[a-zA-Z0-9._-]+$/; 
    const tg_linkRegex = /^@?[a-zA-Z0-9_]{5,}$/; 
    const phone_numberRegex = /^(?:\+7|8)\d{10}$|^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/; 

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
      case 'parname':
        if (value && !nameRegex.test(value)) newErrors.parname = "Неверный формат";
        else delete newErrors.parname;
        break;
      case 'vk_link':
        if (!value) newErrors.vk_link = "Обязательное поле";
        else if (!vk_linkRegex.test(value)) newErrors.vk_link = "Неверный формат";
        else delete newErrors.vk_link;
        break;
      case 'tg_link':
        if (!value) newErrors.tg_link = "Обязательное поле";
        else if (!tg_linkRegex.test(value)) newErrors.tg_link = "Неверный формат";
        else delete newErrors.tg_link;
        break;
      case 'phone_number':
        if (!value) newErrors.phone_number = "Обязательное поле";
        else if (!phone_numberRegex.test(value)) newErrors.phone_number = "Неверный формат";
        else delete newErrors.phone_number;
        break;
      case 'education_program':
        if (!value) newErrors.education_program = "Обязательное поле";
        else delete newErrors.education_program;
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
            parname: formData.parname || null,
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
            if (data.phone_number) {
              setErrors({ ...errors, phone_number: 'Пользователь с таким номером уже зарегистрирован' });
            } else if (data.error) {
              setErrors({ ...errors, phone_number: 'Пользователь с таким номером не зарегистрирован' });
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
                name="parname"
                value={formData.parname}
                onChange={handleChange}
                placeholder="Иванович"
                style={{ borderColor: errors.parname ? '#FF673D' : (formData.parname ? 'white' : 'gray') }}
              />
              {errors.parname && <span className="error-message">{errors.parname}</span>}
            </div>
            <div>
              <label>Ссылка на vk_link</label>
              <input
                type="text"
                name="vk_link"
                value={formData.vk_link}
                onChange={handleChange}
                placeholder={window.innerWidth <= 768 ? "https://vk_link.com/ivan" : "https://vk_link.com/ivanov_vk_link"}
                required
                style={{ borderColor: errors.vk_link ? '#FF673D' : (formData.vk_link ? 'white' : 'gray') }}
              />
              {errors.vk_link && <span className="error-message">{errors.vk_link}</span>}
            </div>
            <div>
              <label>Ник в Telegram</label>
              <input
                type="text"
                name="tg_link"
                value={formData.tg_link}
                onChange={handleChange}
                placeholder="@ivanov_tg_link"
                required
                style={{ borderColor: errors.tg_link ? '#FF673D' : (formData.tg_link ? 'white' : 'gray') }}
              />
              {errors.tg_link && <span className="error-message">{errors.tg_link}</span>}
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
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+7(900)777-14-88"
                required
                style={{ borderColor: errors.phone_number ? '#FF673D' : (formData.phone_number ? 'white' : 'gray') }}
              />
              {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
            </div>
            <div>
              <label>Образовательная программа</label>
              <input
                type="text"
                name="education_program"
                value={formData.education_program}
                onChange={handleChange}
                placeholder={window.innerWidth <= 768 ? "ИВТ" : "Информатика и вычислительная техника"}
                required
                style={{ borderColor: errors.education_program ? '#FF673D' : (formData.education_program ? 'white' : 'gray') }}
              />
              {errors.education_program && <span className="error-message">{errors.education_program}</span>}
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
            {submitError && <span className="error-message" style={{ display: 'block', marginBottom: '10px' }}>{submitError}</span>}
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