import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from './CustomSelect';

const TicketsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    surname: "",
    name: "",
    parname: "",
    course: "",
    university: "",
    tg_link: "",
    payment_method: "",
    agreeTerms: false,
    subscribed: false,
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const requiredFields = ['surname', 'name', 'course', 'university', 'tg_link', 'payment_method', 'agreeTerms'];
    
    const hasErrors = Object.values(errors).some(error => !!error);
    const allFieldsFilled = requiredFields.every(field => {
      if (typeof formData[field] === 'boolean') {
        return formData[field] === true;
      }
      return !!formData[field];
    });

    setIsFormValid(allFieldsFilled && !hasErrors);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const newFormData = { ...formData, [name]: newValue };
    setFormData(newFormData);
    validateField(name, newValue, newFormData);
  };

  const validateField = (field, value, currentFormData) => {
    const newErrors = { ...errors };
    const nameRegex = /^[А-ЯЁ][а-яё]+$/;
    const tg_linkRegex = /^@?[a-zA-Z0-9_]{5,}$/;

    switch (field) {
      case "surname":
        if (!value) newErrors.surname = "Обязательное поле";
        else if (!nameRegex.test(value)) newErrors.surname = "Неверный формат";
        else delete newErrors.surname;
        break;
      case "name":
        if (!value) newErrors.name = "Обязательное поле";
        else if (!nameRegex.test(value)) newErrors.name = "Неверный формат";
        else delete newErrors.name;
        break;
      case "parname":
        if (value && !nameRegex.test(value)) newErrors.parname = "Неверный формат";
        else delete newErrors.parname;
        break;
      case "tg_link":
        if (!value) newErrors.tg_link = "Обязательное поле";
        else if (!tg_linkRegex.test(value)) newErrors.tg_link = "Некорректный формат";
        else delete newErrors.tg_link;
        break;
      case "university":
        if (!value) newErrors.university = "Обязательное поле";
        else delete newErrors.university;
        break;
      case "course":
        if (!value) newErrors.course = "Выберите курс";
        else delete newErrors.course;
        break;
      case "payment_method":
        if (!value) newErrors.payment_method = "Выберите способ оплаты";
        else delete newErrors.payment_method;
        break;
      case "agreeTerms":
        if (!value) newErrors.agreeTerms = "Нужно согласие с условиями";
        else delete newErrors.agreeTerms;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };
  
  useEffect(() => {
    validateForm();
  }, [formData, errors]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!isFormValid) {
      console.log("Форма невалидна");
      setSubmitError("Пожалуйста, заполните все обязательные поля корректно.");
      return;
    }
    
    console.log("Форма отправлена:", formData);
    try {
      const response = await fetch("http://localhost:8000/api/supabase/activate-first-wave/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parname: formData.parname || null,
          course: Number(formData.course),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data);
        navigate("/check-in");
      } else {
        if (response.status === 400) {
          setSubmitError("К сожалению, все билеты этой волны закончились");
        } else if (response.status === 403) {
          setSubmitError("К сожалению, вы в черном списке.");
        } else {
          const data = await response.json();
          console.error("Ошибка:", data);
          setSubmitError("Произошла ошибка при отправке формы.");
        }
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setSubmitError("Ошибка сети. Пожалуйста, проверьте ваше подключение.");
    }
  };

  return (
    <div className="tickets-background">
      <div className="registration">
        <h1 className="head-title">покупка билета</h1>
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
                style={{ borderColor: errors.surname ? "#FF673D" : (formData.surname ? "white" : "gray") }}
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
                style={{ borderColor: errors.name ? "#FF673D" : (formData.name ? "white" : "gray") }}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div>
              <label>Отчество</label>
              <input
                type="text"
                name="parname"
                value={formData.parname}
                onChange={handleChange}
                placeholder="Иванович"
                style={{ borderColor: errors.parname ? "#FF673D" : (formData.parname ? "white" : "gray") }}
              />
              {errors.parname && <span className="error-message">{errors.parname}</span>}
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
              {errors.course && <span className="error-message">{errors.course}</span>}
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
                style={{ borderColor: errors.university ? "#FF673D" : (formData.university ? "white" : "gray") }}
              />
              {errors.university && <span className="error-message">{errors.university}</span>}
            </div>
            <div>
              <label>Ник в Telegram</label>
              <input
                type="text"
                name="tg_link"
                value={formData.tg_link}
                onChange={handleChange}
                placeholder="@nickname"
                required
                style={{ borderColor: errors.tg_link ? "#FF673D" : (formData.tg_link ? "white" : "gray") }}
              />
              {errors.tg_link && <span className="error-message">{errors.tg_link}</span>}
            </div>
            <div>
              <label>Способ оплаты</label>
              <CustomSelect
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                options={[
                  { value: "card", label: "Переводом" },
                  { value: "sbp", label: "Очно в вузе наличными" },
                ]}
              />
              {errors.payment_method && <span className="error-message">{errors.payment_method}</span>}
            </div>
            <div className="checkbox-wrapper">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                  className="custom-checkbox"
                />
                <span>Ознакомлен с условиями покупки билетов</span>
              </label>
              {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
            </div>
            <div className="checkbox-wrapper">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="subscribed"
                  checked={formData.subscribed}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span>Подписан на соцсети мероприятия</span>
              </label>
            </div>
          </div>
          <div className="submit-wrapper">
            {submitError && <span className="error-submit">{submitError}</span>}
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

export default TicketsForm;