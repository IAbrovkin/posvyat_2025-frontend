import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from './CustomSelect';

const TicketsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    course: "",
    university: "",
    tg: "",
    payment: "",
    agreeTerms: false,
    subscribed: false,
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    validateField(name, type === "checkbox" ? checked : value);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    const nameRegex = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+(\s[А-ЯЁ][а-яё]+)?$/;
    const tgRegex = /^@?[a-zA-Z0-9_]{5,}$/;

    switch (field) {
      case "fullname":
        if (!value) newErrors.fullname = "Обязательное поле";
        else if (!nameRegex.test(value)) newErrors.fullname = "Введите ФИО полностью";
        else delete newErrors.fullname;
        break;
      case "tg":
        if (!value) newErrors.tg = "Обязательное поле";
        else if (!tgRegex.test(value)) newErrors.tg = "Некорректный формат";
        else delete newErrors.tg;
        break;
      case "university":
        if (!value) newErrors.university = "Обязательное поле";
        else delete newErrors.university;
        break;
      case "course":
        if (!value) newErrors.course = "Выберите курс";
        else delete newErrors.course;
        break;
      case "payment":
        if (!value) newErrors.payment = "Выберите способ оплаты";
        else delete newErrors.payment;
        break;
      case "agreeTerms":
        if (!value) newErrors.agreeTerms = "Нужно согласие с условиями";
        else delete newErrors.agreeTerms;
        break;
      default:
        break;
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Форма отправлена:", formData);
      try {
        const response = await fetch("/api/supabase/create_record/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Response:", data);
          navigate("/success");
        } else {
          console.error("Ошибка:", data);
        }
      } catch (error) {
        console.error("Ошибка сети:", error);
      }
    }
  };

  return (
    <div className="tickets-background">
      <div className="registration">
        <h1 className="head-title">покупка билета</h1>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-grid">
            <div>
              <label>ФИО</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Иванов Иван Иванович"
                required
                style={{ borderColor: errors.fullname ? "#FF673D" : (formData.fullname ? "white" : "gray") }}
              />
              {errors.fullname && <span className="error-message">{errors.fullname}</span>}
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
                name="tg"
                value={formData.tg}
                onChange={handleChange}
                placeholder="@nickname"
                required
                style={{ borderColor: errors.tg ? "#FF673D" : (formData.tg ? "white" : "gray") }}
              />
              {errors.tg && <span className="error-message">{errors.tg}</span>}
            </div>
            <div>
              <label>Способ оплаты</label>
              <CustomSelect
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                options={[
                  { value: "card", label: "Переводом" },
                  { value: "sbp", label: "Очно в вузе наличными" },
                ]}
              />
              {errors.payment && <span className="error-message">{errors.payment}</span>}
            </div>
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                Ознакомлен с условиями покупки билетов
              </label>
              {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
            </div>
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  name="subscribed"
                  checked={formData.subscribed}
                  onChange={handleChange}
                />
                Подписан на соцсети мероприятия
              </label>
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

export default TicketsForm;
