import React, { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';
import { useNavigate, useLocation } from 'react-router-dom';

const TransferForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    middle_name: "",
    email: "",
    vk: "",
    tg: "",
    phone: "",
    from: "Одинцово",
    departure_time: "",  
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [transferTimes, setTransferTimes] = useState({
    "Одинцово": ["15:15", "15:35", "15:55"], 
    "Парк Победы": ["15:55", "17:35"]
  }); 

  useEffect(() => {
    const fetchTransferTimes = async () => {
      try {
        const response = await fetch('api/v1/times');
        const data = await response.json();
        setTransferTimes(data);
      } catch (error) {
        console.error('Ошибка при получении времени трансфера:', error);
      }
    };

    fetchTransferTimes();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    const nameRegex = /^[А-ЯЁ][а-яё]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const vkRegex = /^https?:\/\/(www\.)?vk\.com\/[a-zA-Z0-9._-]+$/; 
    const tgRegex = /^@?[a-zA-Z0-9_]{5,}$/; 
    const phoneRegex = /^(?:\+7|8)\d{10}$|^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;

    switch (field) {
      case 'surname':
        if (!value) {
          newErrors.surname = "Обязательное поле";
        } else if (!nameRegex.test(value)) {
          newErrors.surname = "Неверный формат";
        } else {
          delete newErrors.surname;
        }
        break;
      case 'name':
        if (!value) {
          newErrors.name = "Обязательное поле";
        } else if (!nameRegex.test(value)) {
          newErrors.name = "Неверный формат";
        } else {
          delete newErrors.name;
        }
        break;
      case 'middle_name':
        if (value && !nameRegex.test(value)) {
          newErrors.middle_name = "Неверный формат";
        } else {
          delete newErrors.middle_name;
        }
        break;
      case 'email':
        if (!value) {
          newErrors.email = "Обязательное поле";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Неверный формат";
        } else {
          delete newErrors.email;
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
      case 'from':
        if (!value) {
          newErrors.from = "Обязательное поле";
        } else {
          delete newErrors.from;
        }
        break;
      case 'departure_time':
        if (!value) {
          newErrors.departure_time = "Обязательное поле";
        } else {
          delete newErrors.departure_time;
        }
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
      console.log('Форма отправлена:', formData);

      try {
        const response = await fetch('/api/supabase/create_record/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            surname: formData.surname,
            middle_name: formData.middle_name || null,
            email: formData.email,
            vk: formData.vk,
            tg: formData.tg,
            phone: formData.phone,
            _from: formData.from,
            departure_time: formData.departure_time,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Response:', data);
          navigate('/check-in');
        } else {
          console.error('Ошибка:', data);
          if (data.phone) {
            setErrors({ ...errors, phoneExists: 'Пользователь с таким телефоном уже зарегистрирован' });
          } else if (data.error) {
            setErrors({ ...errors, phoneExists: 'Пользователь с таким телефоном не зарегистрирован' });
          }
        }
      } catch (error) {
        console.error('Ошибка сети:', error);
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
              placeholder="example@mail.com"
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
            <label>Ссылка на tg</label>
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
            {errors.phoneExists && <span className="error">{errors.phoneExists}</span>}
          </div>
          <div>
            <label>Откуда</label>
            <CustomSelect
              name="from"
              value={formData.from}
              onChange={handleChange}
              options={[
                { value: 'Одинцово', label: 'Одинцово' },
                { value: 'Парк Победы', label: 'Парк Победы' },
              ]}
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
              options={formData.from
                ? transferTimes[formData.from].map(time => ({
                    value: time,
                    label: time,
                  }))
                : []}
              required
            />
            {errors.departure_time && <span className="error-message">{errors.departure_time}</span>}
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

export default TransferForm;