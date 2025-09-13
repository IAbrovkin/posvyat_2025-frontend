import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from './CustomSelect';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    middle_name: "",
    email: "",
    vk: "",
    tg: "",
    phone: "",
    bday: "",
    sex: "Мужской",
    university: "",
    faculty: "",
    program: "",
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
      'name', 'surname', 'email', 'vk', 'tg', 'phone', 
      'bday', 'university', 'faculty', 'program', 'group'
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
    const vkRegex = /^https?:\/\/(www\.)?vk\.com\/[a-zA-Z0-9._-]+$/; 
    const tgRegex = /^@?[a-zA-Z0-9_]{5,}$/; 
    const phoneRegex = /^(?:\+7|8)\d{10}$|^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;

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
      case 'middle_name':
        if (value && !nameRegex.test(value)) newErrors.middle_name = "Неверный формат";
        else delete newErrors.middle_name;
        break;
      case 'email':
        if (!value) newErrors.email = "Обязательное поле";
        else if (!emailRegex.test(value)) newErrors.email = "Неверный формат";
        else delete newErrors.email;
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
        if (newErrors.phoneExists) delete newErrors.phoneExists;
        break;
      case 'university':
        if (!value) newErrors.university = "Обязательное поле";
        else delete newErrors.university;
        break;
      case 'faculty':
        if (!value) newErrors.faculty = "Обязательное поле";
        else delete newErrors.faculty;
        break;
      case 'program':
        if (!value) newErrors.program = "Обязательное поле";
        else delete newErrors.program;
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
        const response = await fetch('/api/supabase/create_record/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            middle_name: formData.middle_name || null,
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
            if (data.phone) {
              setErrors({ ...errors, phone: 'Пользователь с таким телефоном уже зарегистрирован' });
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
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                placeholder="Иванович"
                style={{ borderColor: errors.middle_name ? '#FF673D' : (formData.middle_name ? 'white' : 'gray') }}
              />
              {errors.middle_name && <span className="error-message">{errors.middle_name}</span>}
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
                placeholder="@student"
                required
                style={{ borderColor: errors.tg ? '#FF673D' : (formData.tg ? 'white' : 'gray') }}
              />
              {errors.tg && <span className="error-message">{errors.tg}</span>}
            </div>
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
              <label>Дата рождения</label>
              <input
                type="date"
                name="bday"
                value={formData.bday}
                onChange={handleChange}
                required
                style={{ borderColor: errors.bday ? '#FF673D' : 'gray' }}
              />
            </div>
            <div>
              <label>Пол</label>
              <CustomSelect
                name="sex"
                value={formData.sex}
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
                name="program"
                value={formData.program}
                onChange={handleChange}
                placeholder="ИВТ"
                required
                style={{ borderColor: errors.program ? '#FF673D' : (formData.program ? 'white' : 'gray') }}
              />
              {errors.program && <span className="error-message">{errors.program}</span>}
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