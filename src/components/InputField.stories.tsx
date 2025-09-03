import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { InputField } from './InputField';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A professional input field component with multiple variants, sizes, and states.
Supports controlled and uncontrolled usage, validation, and accessibility features.

## Features
- Multiple visual variants (filled, outlined, ghost)
- Three sizes (small, medium, large)
- Various input types (text, email, password, number, tel, url)
- States: disabled, loading, error, success
- Optional clear button and password toggle
- Helper text and error message support
- Full accessibility compliance
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'ghost'],
      description: 'Visual style variant of the input field',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input field',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'HTML input type',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows loading spinner and disables input',
    },
    invalid: {
      control: { type: 'boolean' },
      description: 'Applies error styling to the input',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Marks the field as required',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Makes the input read-only',
    },
    showClearButton: {
      control: { type: 'boolean' },
      description: 'Shows clear button when input has value',
    },
    showPasswordToggle: {
      control: { type: 'boolean' },
      description: 'Shows password visibility toggle (only for password type)',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with basic props
export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email address',
    helperText: "We'll never share your email with anyone else.",
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic input field with label, placeholder, and helper text.',
      },
    },
  },
};

// Variants showcase
export const Variants: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <InputField
        label="Filled Variant"
        variant="filled"
        placeholder="This is a filled input"
        helperText="Filled variant with background color"
      />
      <InputField
        label="Outlined Variant"
        variant="outlined"
        placeholder="This is an outlined input"
        helperText="Outlined variant with border (default)"
      />
      <InputField
        label="Ghost Variant"
        variant="ghost"
        placeholder="This is a ghost input"
        helperText="Ghost variant with no background or border"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of all three visual variants: filled, outlined, and ghost.',
      },
    },
  },
};

// Sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <InputField
        label="Small Size"
        size="sm"
        placeholder="Small input (32px height)"
      />
      <InputField
        label="Medium Size"
        size="md"
        placeholder="Medium input (40px height) - Default"
      />
      <InputField
        label="Large Size"
        size="lg"
        placeholder="Large input (48px height)"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of all three sizes: small (32px), medium (40px), and large (48px).',
      },
    },
  },
};

// States showcase
export const States: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <InputField
        label="Disabled State"
        disabled
        placeholder="This input is disabled"
        helperText="Disabled inputs cannot be interacted with"
      />
      <InputField
        label="Loading State"
        loading
        placeholder="This input is loading"
        helperText="Loading state shows spinner and disables input"
      />
      <InputField
        label="Error State"
        invalid
        errorMessage="This field has an error"
        placeholder="Input with error styling"
      />
      <InputField
        label="Required Field"
        required
        placeholder="This field is required"
        helperText="Required fields are marked with an asterisk (*)"
      />
      <InputField
        label="Read Only"
        readOnly
        value="This value cannot be edited"
        helperText="Read-only inputs display value but cannot be modified"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Various states of the input field: disabled, loading, error, required, and read-only.',
      },
    },
  },
};

// Features showcase
export const Features: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <InputField
        label="With Clear Button"
        showClearButton
        placeholder="Type something to see clear button"
        helperText="Clear button appears when input has value"
      />
      <InputField
        label="Password with Toggle"
        type="password"
        showPasswordToggle
        placeholder="Enter your password"
        helperText="Click the eye icon to toggle password visibility"
      />
      <InputField
        label="Email with Clear Button"
        type="email"
        showClearButton
        placeholder="Enter your email"
        helperText="Both clear button and email validation"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Special features: clear button for text inputs and password toggle for password fields.',
      },
    },
  },
};

// Form validation examples
export const FormExamples: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      phone: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
      const newErrors: Record<string, string> = {};

      // Email validation
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Age validation
      if (
        formData.age &&
        (parseInt(formData.age) < 18 || parseInt(formData.age) > 120)
      ) {
        newErrors.age = 'Age must be between 18 and 120';
      }

      // Phone validation
      if (
        formData.phone &&
        !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))
      ) {
        newErrors.phone = 'Please enter a valid phone number';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        alert('Form submitted successfully!');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="w-96 space-y-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Registration Form
        </h3>

        <InputField
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
          required
          invalid={!!errors.email}
          errorMessage={errors.email}
          showClearButton
        />

        <InputField
          label="Password"
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter your password"
          required
          invalid={!!errors.password}
          errorMessage={errors.password}
          showPasswordToggle
          helperText="Must be at least 8 characters long"
        />

        <InputField
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={e =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder="Confirm your password"
          required
          invalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
          showPasswordToggle
        />

        <InputField
          label="Age"
          type="number"
          value={formData.age}
          onChange={e => setFormData({ ...formData, age: e.target.value })}
          placeholder="Enter your age"
          invalid={!!errors.age}
          errorMessage={errors.age}
          helperText="Optional: Must be 18 or older"
        />

        <InputField
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter your phone number"
          invalid={!!errors.phone}
          errorMessage={errors.phone}
          helperText="Optional: International format supported"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Registration
        </button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete form example demonstrating validation, error handling, and different input types working together.',
      },
    },
  },
};

// Interactive controlled input
export const ControlledInput: Story = {
  render: () => {
    const [value, setValue] = useState('Hello World');
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      setIsValid(newValue.length >= 3);
    };

    return (
      <div className="w-96 space-y-4">
        <InputField
          label="Controlled Input"
          value={value}
          onChange={handleChange}
          placeholder="Type something..."
          invalid={!isValid}
          errorMessage={!isValid ? 'Input must be at least 3 characters' : ''}
          helperText="This input is controlled by React state"
          showClearButton
        />
        <div className="text-sm text-gray-600">
          <p>Current value: &quot;{value}&quot;</p>
          <p>Length: {value.length} characters</p>
          <p>Valid: {isValid ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive controlled input that demonstrates real-time validation and state management.',
      },
    },
  },
};

// All input types showcase
export const InputTypes: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <InputField
        label="Text Input"
        type="text"
        placeholder="Enter any text"
        helperText="Default text input type"
      />
      <InputField
        label="Email Input"
        type="email"
        placeholder="user@example.com"
        helperText="Email input with built-in validation"
      />
      <InputField
        label="Password Input"
        type="password"
        placeholder="Enter password"
        showPasswordToggle
        helperText="Password input with visibility toggle"
      />
      <InputField
        label="Number Input"
        type="number"
        placeholder="Enter a number"
        helperText="Number input with increment/decrement arrows"
      />
      <InputField
        label="Telephone Input"
        type="tel"
        placeholder="+1 (555) 123-4567"
        helperText="Telephone input optimized for mobile keyboards"
      />
      <InputField
        label="URL Input"
        type="url"
        placeholder="https://example.com"
        helperText="URL input with protocol validation"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All supported input types with appropriate placeholders and helper text.',
      },
    },
  },
};
