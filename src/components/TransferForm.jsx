import React, { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';
import { useNavigate } from 'react-router-dom';

const TransferForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    parname: "",
    email: "",
    vk_link: "",
    tg_link: "",
    phone_number: "",
    from: "Одинцово",
    departure_time: "",  
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [transferTimes, setTransferTimes] = useState({
    "Одинцово": [], 
    "Парк Победы": []
  }); 

  useEffect(() => {
    const fetchTransferTimes = async () => {
      try {
        const response = await fetch('api/v1/times');
        if (response.ok) {
          const data = await response.json();
          setTransferTimes(data);
          const defaultFrom = formData.from;
          if (data[defaultFrom] && data[defaultFrom].length > 0) {
            setFormData(prevData => ({
              ...prevData,
              departure_time: "" 
            }));
          }
        } else {
           console.error('Ошибка при получении времени трансфера: сервер ответил ошибкой');
           setTransferTimes({
            "Одинцово": ["15:15", "15:35", "15:55"], 
            "Парк Победы": ["15:55", "17:35"]
          });
        }
      } catch (error) {
        console.error('Ошибка при получении времени трансфера:', error);
        // Fallback to default hardcoded times in case of network error
        setTransferTimes({
            "Одинцово": ["15:15", "15:35", "15:55"], 
            "Парк Победы": ["15:55", "17:35"]
        });
      }
    };

    fetchTransferTimes();
  }, []);

  const validateForm = (currentErrors, currentFormData) => {
    const requiredFields = ['name', 'surname', 'email', 'vk_link', 'tg_link', 'phone_number', 'from', 'departure_time'];
    
    const hasErrors = Object.keys(currentErrors).some(key => {
        return requiredFields.includes(key) && currentErrors[key];
    });

    const allFieldsFilled = requiredFields.every(field => !!currentFormData[field]);
    
    setIsFormValid(allFieldsFilled && !hasErrors);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (name === "from") {
        newFormData.departure_time = "";
    }

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
      case 'from':
        if (!value) newErrors.from = "Обязательное поле";
        else delete newErrors.from;
        break;
      case 'departure_time':
        if (!value) newErrors.departure_time = "Обязательное поле";
        else delete newErrors.departure_time;
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
            parname: formData.parname || null,
            _from: formData.from, 
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response:', data);
          navigate('/check-in');
        } else {
          if (response.status === 403) {
            setSubmitError("К сожалению, вы в черном списке.");
          } else {
            const data = await response.json();
            console.error('Ошибка:', data);
            if (data.phone_number) {
              setErrors({ ...errors, phone_number: 'Пользователь с таким телефоном уже зарегистрирован' });
            } else if (data.error) {
               setErrors({ ...errors, phone_number: 'Пользователь с таким телефоном не зарегистрирован' });
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
    <div className="transfer-background" >
      <div className="registration">
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="head-title">Трансфер</div>
          <p className='registration-form-text'>До места проведения можно добраться как самостоятельно, так и предложенным трансфером.<br /><br />Автобусы стартуют с нескольких точек в разное время — вы можете выбрать для себя оптимальный вариант.</p>
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
                placeholder="example@mail.com"
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
              <label>Откуда</label>
              <CustomSelect
                name="from"
                value={formData.from}
                onChange={handleChange}
                options={Object.keys(transferTimes).map(location => ({
                  value: location,
                  label: location
                }))}
                required
              />
              {errors.from && <span className="error-message">{errors.from}</span>}
            </div>
            <div>
              <label>Время отправления</label>
              <CustomSelect
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                options={
                  transferTimes[formData.from]
                    ? transferTimes[formData.from].map(time => ({
                        value: time,
                        label: time,
                      }))
                    : []
                }
                required
              />
              {errors.departure_time && <span className="error-message">{errors.departure_time}</span>}
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

export default TransferForm;