import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from './CustomSelect';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    parname: "",
    email: "",
    vk_link: "",
    tg_link: "",
    phone_number: "",
    birthday_date: "",
    gender: "Мужской",
    university: "",
    faculty: "",
    education_program: "",
    group: "",
    transfer: "Да, от Одинцово и обратно",
    course: 1,
    health_features: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = (currentErrors, currentFormData) => {
    const requiredFields = [
      'name', 'surname', 'email', 'vk_link', 'tg_link', 'phone_number', 
      'birthday_date', 'university', 'faculty', 'education_program', 'group'
    ];
    
    const hasErrors = Object.keys(currentErrors).some(key => {
        return requiredFields.includes(key) && currentErrors[key];
    });

    const allFieldsFilled = requiredFields.every(field => !!currentFormData[field]);
    
    setIsFormValid(allFieldsFilled && !hasErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    validateField(name, value, newFormData);
  };

  const validateField = (field, value, currentFormData) => {
    const newErrors = { ...errors };
    const nameRegex = /^[А-ЯЁ][а-яё]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const vk_linkRegex = /^https?:\/\/(www\.)?vk_link\.com\/[a-zA-Z0-9._-]+$/; 
    const tg_linkRegex = /^@?[a-zA-Z0-9_]{5,}$/; 
    const phone_numberRegex = /^(?:\+7|8)\d{10}$|^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;

    switch (field) {
      case 'surname':
        if (!value) newErrors.surname = "Обязательное поле";
        else if (!nameRegex.test(value)) newErrors.surname = "Неверный формат";
        else delete newErrors.surname;
        break;
      case 'name':
        if (!value) newErrors.name = "Обязательное поле";
        else if (!nameRegex.test(value)) newErrors.name = "Неверный формат";
        else delete newErrors.name;
        break;
      case 'parname':
        if (value && !nameRegex.test(value)) newErrors.parname = "Неверный формат";
        else delete newErrors.parname;
        break;
      case 'email':
        if (!value) newErrors.email = "Обязательное поле";
        else if (!emailRegex.test(value)) newErrors.email = "Неверный формат";
        else delete newErrors.email;
        break;
      case 'vk_link':
        if (!value) newErrors.vk = "Обязательное поле";
        else if (!vk_linkRegex.test(value)) newErrors.vk = "Неверный формат";
        else delete newErrors.vk;
        break;
      case 'tg_link':
        if (!value) newErrors.tg = "Обязательное поле";
        else if (!tg_linkRegex.test(value)) newErrors.tg = "Неверный формат";
        else delete newErrors.tg;
        break;
      case 'phone_number':
        if (!value) newErrors.phone_number = "Обязательное поле";
        else if (!phone_numberRegex.test(value)) newErrors.phone_number = "Неверный формат";
        else delete newErrors.phone_number;
        if (newErrors.phone_numberExists) delete newErrors.phone_numberExists;
        break;
      case 'university':
        if (!value) newErrors.university = "Обязательное поле";
        else delete newErrors.university;
        break;
      case 'faculty':
        if (!value) newErrors.faculty = "Обязательное поле";
        else delete newErrors.faculty;
        break;
      case 'education_program':
        if (!value) newErrors.education_program = "Обязательное поле";
        else delete newErrors.education_program;
        break;
      case 'group':
        if (!value) newErrors.group = "Обязательное поле";
        else delete newErrors.group;
        break;
      default:
        break;
    }
    setErrors(newErrors);
    validateForm(newErrors, currentFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (isFormValid) {
      try {
        //const response = await fetch('/api/supabase/create_record/', {
        const response = await fetch('http://localhost:8000/api/supabase/create_record/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            parname: formData.parname || null,
            course: Number(formData.course),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response:', data);
          navigate('/tickets');
        } else {
          if (response.status === 403) {
            setSubmitError("К сожалению, вы в черном списке.");
          } else {
            const data = await response.json();
            console.error('Ошибка:', data);
            if (data.phone_number) {
              setErrors({ ...errors, phone_number: 'Пользователь с таким телефоном уже зарегистрирован' });
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
    <div className="registration-background">
      <div className="registration">
        <h1 className="head-title">Регистрация</h1>
        <form onSubmit={handleSubmit} className="registration-form">
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
              <label>Почта</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="posvyat@edu.hse.ru"
                required
                style={{ borderColor: errors.email ? '#FF673D' : (formData.email ? 'white' : 'gray') }}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
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
                placeholder="@student"
                required
                style={{ borderColor: errors.tg_link ? '#FF673D' : (formData.tg_link ? 'white' : 'gray') }}
              />
              {errors.tg_link && <span className="error-message">{errors.tg_link}</span>}
            </div>
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
              <label>Дата рождения</label>
              <input
                type="date"
                name="birthday_date"
                value={formData.birthday_date}
                onChange={handleChange}
                required
                style={{ borderColor: errors.birthday_date ? '#FF673D' : 'gray' }}
              />
            </div>
            <div>
              <label>Пол</label>
              <CustomSelect
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: "Мужской", label: 'Мужской' },
                  { value: "Женский", label: 'Женский' }
                ]}
              />
            </div>
            <div>
              <label>ВУЗ</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="НИУ ВШЭ"
                required
                style={{ borderColor: errors.university ? '#FF673D' : (formData.university ? 'white' : 'gray') }}
              />
              {errors.university && <span className="error-message">{errors.university}</span>}
            </div>
            <div>
              <label>Факультет</label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                placeholder="МИЭМ"
                required
                style={{ borderColor: errors.faculty ? '#FF673D' : (formData.faculty ? 'white' : 'gray') }}
              />
              {errors.faculty && <span className="error-message">{errors.faculty}</span>}
            </div>
            <div>
              <label>Программа</label>
              <input
                type="text"
                name="education_program"
                value={formData.education_program}
                onChange={handleChange}
                placeholder="ИВТ"
                required
                style={{ borderColor: errors.education_program ? '#FF673D' : (formData.education_program ? 'white' : 'gray') }}
              />
              {errors.education_program && <span className="error-message">{errors.education_program}</span>}
            </div>
            <div>
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
            <div>
              <label>Группа</label>
              <input
                type="text"
                name="group"
                value={formData.group}
                onChange={handleChange}
                placeholder="БИВ001"
                required
                style={{ borderColor: errors.group ? '#FF673D' : (formData.group ? 'white' : 'gray') }}
              />
              {errors.group && <span className="error-message">{errors.group}</span>}
            </div>
            <div>
              <label>Нужен ли тебе трансфер?</label>
              <CustomSelect
                name="transfer"
                value={formData.transfer}
                onChange={handleChange}
                options={[
                  { value: 'Да, от Одинцово и обратно', label: 'Да, от Одинцово' },
                  { value: 'Да, от Парка Победы и обратно', label: 'Да, от Парка Победы' },
                  { value: 'Не нужен', label: 'Нет, не нужен' },
                ]}
              />
            </div>
          </div>
          <div>
            <label>Особенности здоровья</label>
            <textarea
              name="health_features"
              value={formData.health_features}
              onChange={handleChange}
              placeholder="Введите особенности здоровья"
            />
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

export default RegistrationForm;