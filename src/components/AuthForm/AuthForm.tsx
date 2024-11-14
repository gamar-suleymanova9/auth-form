import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWizard from 'react-step-wizard';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '../../store/authStore';
import OtpInput from 'react-otp-input';

// Validation schemas for step 1 and step 2
const validationSchemaStep1 = Yup.object({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
});

const validationSchemaStep2 = Yup.object({
  code: Yup.string()
    .length(6, 'Code must be 6 characters')
    .required('Required'),
});

// Step 1 - Email and Password
const Step1: React.FC<any> = ({ nextStep, setFormData }) => (
  <Formik
    initialValues={{ email: '', password: '' }}
    validationSchema={validationSchemaStep1}
    onSubmit={(values) => {
      // Store the form data in the parent component
      setFormData((prevData: any) => ({ ...prevData, ...values }));
      nextStep();
    }}
  >
    <Form>
      <div className='field-container'>
        <Field name="email">
            {({ field, meta }: any) => {
                const inputClass = meta.touched
                ? meta.error
                    ? 'invalid'
                    : 'valid'
                : 'input';

                const errorClass = meta.touched && meta.error ? 'error active' : 'error';

                return (
                <>
                    <label htmlFor="email">Email</label>
                    <input
                        {...field}
                        type="text"
                        placeholder="E-mail"
                        id='email'
                        className={` ${inputClass}`}
                        autoComplete='email' />
                    <div className={errorClass}>
                        {meta.error? meta.error: 'no error'}
                    </div>
                </>
                );
            }}
        </Field>
      </div>
      <div className='field-container'>
      <Field name="password">
            {({ field, meta }: any) => {
                const inputClass = meta.touched
                ? meta.error
                    ? 'invalid'
                    : 'valid'
                : 'input';

                const errorClass = meta.touched && meta.error ? 'error active' : 'error';

                return (
                <>
                    <label htmlFor="password">Password</label>
                    <input
                        {...field}
                        type="password"
                        placeholder="Password"
                        id='password'
                        className={` ${inputClass}`}
                        autoComplete='current-password' />
                    <div className={errorClass}>
                        {meta.error? meta.error: 'no error'}
                    </div>
                </>
                );
            }}
        </Field>
      </div>
      <button type="submit">Next</button>
    </Form>
  </Formik>
);

// Step 2 - Identification Code
const Step2: React.FC<any> = ({ nextStep, prevStep, setFormData }) => {
  const [otp, setOtp] = React.useState('');
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ code: '' }}
      validationSchema={validationSchemaStep2}
      onSubmit={(values) => {
        // Store the form data in the parent component
        setFormData((prevData: any) => ({ ...prevData, otp: values.code }));
        nextStep();

        // Delay navigation after the step is completed
        setTimeout(() => {
          navigate('/home'); // Navigate to the home page after a short delay
        }, 2400); // 1-second delay for better UX
      }}
    >
        {({ values, handleChange, handleBlur }) => (
            <Form>
                <div className='field-container'>
                <Field name="code">
                    {({ field, meta }: any) => {
                        const inputClass = meta.touched
                        ? meta.error
                            ? 'invalid'
                            : 'valid'
                        : 'input';

                        const errorClass = meta.touched && meta.error ? 'error active' : 'error';

                        return (
                        <>
                            <label htmlFor="code">Identification Code</label>
                            <OtpInput
                                {...field} // Spread Formik's field props
                                id="code"
                                className={inputClass}
                                value={values.code}
                                onChange={(otpValue: string) => handleChange({ target: { name: 'code', value: otpValue } })}
                                onBlur={handleBlur}
                                numInputs={6}
                                renderSeparator={<span>-</span>}
                                renderInput={(props) => <input {...props} />}
                            />
                            <div className={errorClass}>
                                {meta.error? meta.error: 'no error'}
                            </div>
                        </>
                        );
                    }}
                </Field>
                
                </div>
                <button type="submit">Next</button>
            </Form>
        )}
    </Formik>
  );
};

// Step 3 - Success
const Step3: React.FC<any> = ({ formData }) => {
  const { login } = useAuthStore();
  useEffect(() => {
    // Log all form data at the end
    console.log("All form data:", formData);
    const token = 'mock-jwt-token';
    localStorage.setItem('auth_token', token);
    login({
        email: formData.email,
        token: token,
    });
  }, [formData]);

  return <h2>Success! You are logged in.</h2>;
};

// Main Form Component
const AuthForm: React.FC = () => {
  const [formData, setFormData] = useState<any>({}); // To store form data across steps
  const [step, setStep] = useState<number>(1); // Track the current step

  const handleStepChange = (newStep: number) => {
    setStep(newStep); // Update the current step when the user navigates
  };

  return (
    <>
      {/* Step Indicator */}
      <div className="step-indicators">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      {/* Form */}
      <StepWizard onStepChange={(e) => handleStepChange(e.activeStep)}>
        <Step1 setFormData={setFormData} />
        <Step2 setFormData={setFormData} />
        <Step3 formData={formData} />
      </StepWizard>
    </>
  );
};

export default AuthForm;
