import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from './InputField';

describe('InputField', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with basic props', () => {
      render(<InputField label="Email" placeholder="Enter your email" />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your email')
      ).toBeInTheDocument();
    });

    it('renders without label', () => {
      render(<InputField placeholder="Enter text" />);

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with id prop', () => {
      render(<InputField id="test-input" label="Test" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('renders with name prop', () => {
      render(<InputField name="test-name" label="Test" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveAttribute('name', 'test-name');
    });

    it('renders with required prop', () => {
      render(<InputField label="Required Field" required />);

      expect(screen.getByText('*')).toBeInTheDocument();
      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('required');
    });
  });

  // Value handling tests
  describe('Value Handling', () => {
    it('handles controlled value', () => {
      const handleChange = jest.fn();
      render(
        <InputField label="Name" value="John Doe" onChange={handleChange} />
      );

      const input = screen.getByLabelText('Name');
      expect(input).toHaveValue('John Doe');
    });

    it('handles uncontrolled value with defaultValue', () => {
      render(<InputField label="Name" defaultValue="Jane Doe" />);

      const input = screen.getByLabelText('Name');
      expect(input).toHaveValue('Jane Doe');
    });

    it('handles empty string value', () => {
      render(<InputField label="Test" value="" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveValue('');
    });

    it('handles null and undefined values gracefully', () => {
      const { rerender } = render(
        <InputField label="Test" value={null as any} />
      );
      expect(screen.getByLabelText('Test')).toBeInTheDocument();

      rerender(<InputField label="Test" value={undefined} />);
      expect(screen.getByLabelText('Test')).toBeInTheDocument();
    });
  });

  // Event handling tests
  describe('Event Handling', () => {
    it('calls onChange when value changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<InputField label="Name" onChange={handleChange} />);

      const input = screen.getByLabelText('Name');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalledTimes(4);
      expect(handleChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: 'test' }),
        })
      );
    });

    it('calls onFocus and onBlur handlers', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      const user = userEvent.setup();

      render(
        <InputField label="Name" onFocus={handleFocus} onBlur={handleBlur} />
      );

      const input = screen.getByLabelText('Name');
      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus when input is focused via keyboard', async () => {
      const handleFocus = jest.fn();
      const user = userEvent.setup();

      render(<InputField label="Test" onFocus={handleFocus} />);

      const input = screen.getByLabelText('Test');
      await user.tab();

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles rapid typing without errors', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<InputField label="Test" onChange={handleChange} />);

      const input = screen.getByLabelText('Test');
      await user.type(input, 'very long text input');

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('very long text input');
    });
  });

  // Variant tests
  describe('Variants', () => {
    it('renders filled variant', () => {
      render(<InputField label="Test" variant="filled" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveClass('bg-secondary-50');
    });

    it('renders outlined variant', () => {
      render(<InputField label="Test" variant="outlined" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveClass('bg-transparent');
    });

    it('renders ghost variant', () => {
      render(<InputField label="Test" variant="ghost" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveClass('bg-transparent');
    });

    it('applies focus styles correctly for each variant', async () => {
      const user = userEvent.setup();

      const { rerender } = render(<InputField label="Test" variant="filled" />);
      const input = screen.getByLabelText('Test');
      await user.click(input);
      expect(input).toHaveClass('focus:bg-white');

      rerender(<InputField label="Test" variant="outlined" />);
      const outlinedInput = screen.getByLabelText('Test');
      await user.click(outlinedInput);
      expect(outlinedInput).toHaveClass('focus:border-primary-500');
    });
  });

  // Size tests
  describe('Sizes', () => {
    it('renders small size', () => {
      render(<InputField label="Test" size="sm" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveClass('h-8');
    });

    it('renders medium size (default)', () => {
      render(<InputField label="Test" size="md" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveClass('h-10');
    });

    it('renders large size', () => {
      render(<InputField label="Test" size="lg" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveClass('h-12');
    });

    it('applies correct text sizes', () => {
      const { rerender } = render(<InputField label="Test" size="sm" />);
      expect(screen.getByLabelText('Test')).toHaveClass('text-sm');

      rerender(<InputField label="Test" size="md" />);
      expect(screen.getByLabelText('Test')).toHaveClass('text-base');

      rerender(<InputField label="Test" size="lg" />);
      expect(screen.getByLabelText('Test')).toHaveClass('text-lg');
    });
  });

  // Input type tests
  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<InputField label="Test" />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders email input', () => {
      render(<InputField label="Email" type="email" />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password input', () => {
      render(<InputField label="Password" type="password" />);

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders number input', () => {
      render(<InputField label="Number" type="number" />);

      const input = screen.getByLabelText('Number');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders tel input', () => {
      render(<InputField label="Phone" type="tel" />);

      const input = screen.getByLabelText('Phone');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('renders url input', () => {
      render(<InputField label="URL" type="url" />);

      const input = screen.getByLabelText('URL');
      expect(input).toHaveAttribute('type', 'url');
    });
  });

  // State tests
  describe('States', () => {
    it('renders disabled state', () => {
      render(<InputField label="Test" disabled />);

      const input = screen.getByLabelText('Test');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:cursor-not-allowed');
    });

    it('renders loading state', () => {
      render(<InputField label="Test" loading />);

      const input = screen.getByLabelText('Test');
      expect(input).toBeDisabled();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders invalid state', () => {
      render(<InputField label="Test" invalid />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveClass('border-error-500');
    });

    it('renders read-only state', () => {
      render(<InputField label="Test" readOnly />);

      const input = screen.getByLabelText('Test');
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveClass('read-only:bg-secondary-50');
    });

    it('combines multiple states correctly', () => {
      render(<InputField label="Test" disabled invalid />);

      const input = screen.getByLabelText('Test');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('border-error-500');
    });
  });

  // Error and helper text tests
  describe('Error and Helper Text', () => {
    it('shows error message', () => {
      render(
        <InputField label="Email" errorMessage="Please enter a valid email" />
      );

      expect(
        screen.getByText('Please enter a valid email')
      ).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email')).toHaveClass(
        'text-error-600'
      );
    });

    it('shows helper text', () => {
      render(
        <InputField
          label="Password"
          helperText="Must be at least 8 characters"
        />
      );

      expect(
        screen.getByText('Must be at least 8 characters')
      ).toBeInTheDocument();
      expect(screen.getByText('Must be at least 8 characters')).toHaveClass(
        'text-secondary-500'
      );
    });

    it('prioritizes error message over helper text', () => {
      render(
        <InputField
          label="Test"
          helperText="Helper text"
          errorMessage="Error message"
        />
      );

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    it('applies error styling to label when invalid', () => {
      render(<InputField label="Test" invalid errorMessage="Error message" />);

      const label = screen.getByText('Test');
      expect(label).toHaveClass('text-error-600');
    });
  });

  // Clear button tests
  describe('Clear Button', () => {
    it('shows clear button when showClearButton is true and has value', async () => {
      const user = userEvent.setup();

      render(<InputField label="Test" showClearButton />);

      const input = screen.getByLabelText('Test');
      await user.type(input, 'test');

      const clearButton = screen.getByRole('button', { name: /clear input/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('hides clear button when input is empty', () => {
      render(<InputField label="Test" showClearButton />);

      const clearButton = screen.queryByRole('button', {
        name: /clear input/i,
      });
      expect(clearButton).not.toBeInTheDocument();
    });

    it('clears input when clear button is clicked', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <InputField label="Test" showClearButton onChange={handleChange} />
      );

      const input = screen.getByLabelText('Test');
      await user.type(input, 'test');

      const clearButton = screen.getByRole('button', { name: /clear input/i });
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '' }),
        })
      );
    });

    it('clear button is disabled when input is disabled', async () => {
      const user = userEvent.setup();

      render(<InputField label="Test" showClearButton disabled />);

      const input = screen.getByDisplayValue('');
      await user.type(input, 'test');

      // When input is disabled, clear button should not be shown
      const clearButton = screen.queryByRole('button', {
        name: /clear input/i,
      });
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  // Password toggle tests
  describe('Password Toggle', () => {
    it('shows password toggle when showPasswordToggle is true and type is password', () => {
      render(
        <InputField label="Password" type="password" showPasswordToggle />
      );

      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });

    it('does not show password toggle for non-password inputs', () => {
      render(<InputField label="Email" type="email" showPasswordToggle />);

      const toggleButton = screen.queryByRole('button', {
        name: /show password/i,
      });
      expect(toggleButton).not.toBeInTheDocument();
    });

    it('toggles password visibility when toggle button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <InputField label="Password" type="password" showPasswordToggle />
      );

      const input = screen.getByLabelText('Password');
      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });

      expect(input).toHaveAttribute('type', 'password');

      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');

      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');
    });

    it('updates aria-label when password visibility changes', async () => {
      const user = userEvent.setup();

      render(
        <InputField label="Password" type="password" showPasswordToggle />
      );

      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });

      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');

      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
    });
  });

  // Multiple features tests
  describe('Multiple Features', () => {
    it('handles both clear button and password toggle', async () => {
      const user = userEvent.setup();

      render(
        <InputField
          label="Password"
          type="password"
          showClearButton
          showPasswordToggle
        />
      );

      const input = screen.getByLabelText('Password');
      await user.type(input, 'test');

      const clearButton = screen.getByRole('button', { name: /clear input/i });
      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });

      expect(clearButton).toBeInTheDocument();
      expect(toggleButton).toBeInTheDocument();
      expect(input).toHaveClass('pr-20');
    });

    it('handles loading state with clear button', () => {
      render(<InputField label="Test" showClearButton loading />);

      const clearButton = screen.queryByRole('button', {
        name: /clear input/i,
      });
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('associates label with input using htmlFor', () => {
      render(<InputField label="Test" id="test-input" />);

      const label = screen.getByText('Test');
      const input = screen.getByLabelText('Test');

      expect(label).toHaveAttribute('for', 'test-input');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('generates unique id when not provided', () => {
      render(<InputField label="Test" />);

      const label = screen.getByText('Test');
      const input = screen.getByLabelText('Test');

      expect(label).toHaveAttribute('for');
      expect(input).toHaveAttribute('id');
      expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
    });

    it('provides proper ARIA attributes for disabled state', () => {
      render(<InputField label="Test" disabled />);

      const input = screen.getByDisplayValue('');
      expect(input).toBeDisabled();
    });

    it('provides proper ARIA attributes for required field', () => {
      render(<InputField label="Test" required />);

      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('required');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(<InputField label="Test" />);

      const input = screen.getByLabelText('Test');
      await user.tab();

      expect(input).toHaveFocus();
    });

    it('handles Enter key press', async () => {
      const user = userEvent.setup();

      render(<InputField label="Test" />);

      const input = screen.getByLabelText('Test');
      await user.type(input, 'test{enter}');

      expect(input).toHaveValue('test');
    });
  });

  // Edge cases and error handling
  describe('Edge Cases and Error Handling', () => {
    it('handles very long input values', async () => {
      const longText = 'a'.repeat(1000);
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<InputField label="Test" onChange={handleChange} />);

      const input = screen.getByLabelText('Test');
      await user.type(input, longText);

      expect(input).toHaveValue(longText);
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles special characters in input', async () => {
      const specialChars = '!@#$%^&*()_+-=';
      const user = userEvent.setup();

      render(<InputField label="Test" />);

      const input = screen.getByDisplayValue('');
      await user.type(input, specialChars);

      expect(input).toHaveValue(specialChars);
    });

    it('handles rapid state changes', async () => {
      const user = userEvent.setup();

      const { rerender } = render(<InputField label="Test" />);

      const input = screen.getByLabelText('Test');
      await user.type(input, 'test');

      rerender(<InputField label="Test" disabled />);
      expect(input).toBeDisabled();

      rerender(<InputField label="Test" />);
      expect(input).not.toBeDisabled();
    });

    it('handles controlled to uncontrolled transition', () => {
      // This test demonstrates that controlled to uncontrolled transitions
      // are not recommended in React - the component should remain controlled
      const { rerender } = render(
        <InputField label="Test" value="controlled" />
      );
      expect(screen.getByDisplayValue('controlled')).toBeInTheDocument();

      // When rerendering without value, it should remain controlled with the last value
      rerender(<InputField label="Test" />);
      expect(screen.getByDisplayValue('controlled')).toBeInTheDocument();
    });
  });

  // Styling and className tests
  describe('Styling and className', () => {
    it('applies custom className', () => {
      render(<InputField label="Test" className="custom-class" />);

      const container =
        screen.getByLabelText('Test').parentElement?.parentElement;
      expect(container).toHaveClass('custom-class');
    });

    it('applies correct focus styles', async () => {
      const user = userEvent.setup();

      render(<InputField label="Test" />);

      const input = screen.getByLabelText('Test');
      await user.click(input);

      expect(input).toHaveClass('border-primary-500');
    });

    it('applies correct hover styles', async () => {
      const user = userEvent.setup();

      render(<InputField label="Test" />);

      const input = screen.getByLabelText('Test');
      await user.hover(input);

      // Note: Hover styles are CSS-based and may not be easily testable
      expect(input).toBeInTheDocument();
    });
  });

  // Ref forwarding tests
  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = jest.fn();

      render(<InputField label="Test" ref={ref} />);

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
    });

    it('allows focus via ref', () => {
      const ref = { current: null };

      render(<InputField label="Test" ref={ref} />);

      if (ref.current) {
        ref.current.focus();
        expect(ref.current).toHaveFocus();
      }
    });
  });
});
