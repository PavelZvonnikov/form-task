import React, { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import '../css/form.scss';
import {connect} from 'react-redux';
import {addValues} from '../store/action-creators/action-creators';

const parser = /[А-Яа-я\.]*\s*/i;

// const parseAddress = /[г\.]*\s*[А-Яа-я\-]{2,}[\,\s]*[ул|пер|пр|б-р]*\.\s*[А-Яа-я\-]{2,}[\,\s]*[д\.]*\s*\d{1,3}[\\\d{1,3}]*[\,\s\-]*[кв\.]*\s*\d{1,3}\s*/gmi

const getAddress = (values, target) => {
  const { extendCity, extendStreet, extendHouse, extendFlat } = values;
  const obj =  {
    extendCity: extendCity ? `г. ${extendCity}` : '',
    extendStreet: extendStreet ? `ул. ${extendStreet}` : '',
    extendHouse: extendHouse ? `д. ${extendHouse}` : '',
    extendFlat: extendFlat ? `кв. ${extendFlat}` : '',
  }

  if (target.name === 'extendCity') {
    obj[target.name] = `г. ${target.value}`;
  } else if (target.name === 'extendStreet') {
    obj[target.name] = `ул. ${target.value}`;
  } else if (target.name === 'extendHouse') {
    obj[target.name] = `д. ${target.value}`;
  } else if (target.name === 'extendFlat') {
    obj[target.name] = `кв. ${target.value}`;
  }

  return `${obj.extendCity}, ${obj.extendStreet}, ${obj.extendHouse}, ${obj.extendFlat}`;
}

const validate = values => {
  const errors = {};

  if (!values.address) {
    errors.address = 'Поле обязательно для заполнения.'
  } else if (/[г\.]*\s*[А-Яа-я\-]{2,}[\,\s]*[ул|пер|пр|б-р]*\.\s*[А-Яа-я\-]{2,}[\,\s]*[д\.]*\s*\d{1,3}[\\\d{1,3}]*[\,\s\-]*[кв\.]*\s*\d{1,3}\s*/gmi.test(values.address) === false) {
    errors.address = 'Неправильный адрес.'
  }
  return errors;
}

function Form (props) {
  const {send} = props;

  const formik = useFormik({
    initialValues: {
      address: '',
      extendCity: '',
      extendStreet: '',
      extendHouse: '',
      extendFlat: '',
    },
    validate,
    onSubmit: (values, {resetForm}) => {
      console.log('from submit', values);
      send(values);
      resetForm({
        values: {
          address: '',
          extendCity: '',
          extendStreet: '',
          extendHouse: '',
          extendFlat: '',
        }
      })
    }
  });

  const {
    handleChange,
    handleSubmit,
    values,
    errors
  } = formik;
  const { address, extendCity, extendStreet, extendHouse, extendFlat } = values;

  const [showExtend, setShowExtend] = useState(false);

  const setExtendValues = useCallback((event) => {
    let parsedFull;
    if (event) {
      parsedFull = event.target.value.trim().split(', ');
    } else {
      parsedFull = address.trim().split(', ');
    }
    values.extendCity = parsedFull[0] ? parsedFull[0].replace(parser, '') : '';
    values.extendStreet = parsedFull[1] ? parsedFull[1].replace(parser, '') : '';
    values.extendHouse = parsedFull[2] ? parsedFull[2].replace(parser, '') : '';
    values.extendFlat = parsedFull[3] ? parsedFull[3].replace(parser, '') : '';
  }, [values, address]);

  const toggleShow = useCallback(()=> {
    setShowExtend(!showExtend);
    if (!showExtend) setExtendValues();
  }, [showExtend, setExtendValues]);

  const localHandleChange = useCallback(event=> {
    handleChange(event);
    values.address = getAddress(values, event.target);
  }, [handleChange, values]);

  const changeAddress = useCallback((event) => {
    handleChange(event);
    setExtendValues(event);
  }, [handleChange, setExtendValues]);

  return (
    <div className='form-wrapper'>
      <form className='form' onSubmit={handleSubmit} area-label='Форма ввода адреса'>
        <div className='form__full-address--container'>
          <label className='full-address--label label' htmlFor='full'>Address</label>
          <input
            area-label='Поле ввода полного адреса'
            placeholder='Your address'
            className='full-address--input input'
            type='text'
            name='address'
            disabled={showExtend}
            onChange={changeAddress}
            value={address}
          />
          {errors.address ? <div className='invalid-feedback' area-label='Адрес введен некорректно'>{errors.address}</div> : null}

        </div>
        <button
          className={`full-address__btn ${showExtend ? 'full-address__btn--hidden' : ''}`}
          type='button'
          onClick={toggleShow}
          area-label='Открыть дополнительные поля формы'
        >
          Fill adress parts
        </button>
        <div className={`form__extended-wrapper ${showExtend ? 'form__extended-wrapper--active' : ''}`}>
          <div className='form__extended-part'>
            <button type='button' className='close-extended' onClick={toggleShow} area-label='Скрыть дополнительные поля формы'>
              <div className='close-extended__arrow'></div>
            </button>
            <p className ='extended__heading'>Address:</p>
            <div className='extended__item'>
              <label className='extended__city-label extend-label label' htmlFor='extendCity'>City</label>
              <input
                className='extended__city-input extend-input input'
                type='text' name='extendCity'
                onChange={localHandleChange}
                value={extendCity}
                area-label='Введите название города'
              />
            </div>
            <div className='extended__item'>
              <label className='extended__street-label extend-label label' htmlFor='extendStreet'>Street</label>
              <input
                className='extended__street-input extend-input input'
                type='text'
                name='extendStreet'
                onChange={localHandleChange}
                value={extendStreet}
                area-label='Введите название улицы'
                />
            </div>
            <div className='extended__item extended__item--double'>
              <div className='extended__item extended__item--left'>
                <label className='extended__house-label extend-label label' htmlFor='extendHouse'>House</label>
                <input
                  className='extended__house-input extend-input input'
                  type='text'
                  name='extendHouse'
                  onChange={localHandleChange}
                  value={extendHouse}
                  area-label='Введите номер дома'
                />
              </div>
              <div className='extended__item extended__item--right'>
                <label className='extended__flat-label extend-label label' htmlFor='extendFlat'>Flat</label>
                <input
                  className='extended__flat-input extend-input input'
                  type='text'
                  name='extendFlat'
                  onChange={localHandleChange}
                  value={extendFlat}
                  area-label='Введите номер квартиры'
                />
              </div>
            </div>
          </div>
          </div>
        <button type='submit' area-label='Отправить данные' className={`submit-btn ${showExtend ? 'submit-btn--active' : ''}`}>Send</button>
      </form>
    </div>
  );
}

const mapStateToProps = state => {
  return state.formValues || {}
}

const mapDispatchToProps = {
  send: addValues
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);