import { useState } from 'react';
import { InputField } from './components/InputField';
import { DataTable, Column } from './components/DataTable';
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Globe,
  Calendar,
  Building,
  DollarSign,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// Sample data for DataTable
interface UserData {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  tags: string[];
}

const sampleUsers: UserData[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 32,
    department: 'Engineering',
    salary: 85000,
    joinDate: '2022-01-15',
    status: 'active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    age: 28,
    department: 'Marketing',
    salary: 72000,
    joinDate: '2022-03-20',
    status: 'active',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    age: 35,
    department: 'Sales',
    salary: 78000,
    joinDate: '2021-11-10',
    status: 'inactive',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    age: 29,
    department: 'Engineering',
    salary: 82000,
    joinDate: '2022-05-12',
    status: 'pending',
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    age: 31,
    department: 'HR',
    salary: 65000,
    joinDate: '2022-02-28',
    status: 'active',
  },
];

const sampleProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 199.99,
    stock: 45,
    rating: 4.5,
    tags: ['wireless', 'bluetooth', 'noise-cancelling'],
  },
  {
    id: 'PROD-002',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 299.99,
    stock: 23,
    rating: 4.2,
    tags: ['smartwatch', 'fitness', 'health'],
  },
  {
    id: 'PROD-003',
    name: 'Coffee Maker',
    category: 'Home & Kitchen',
    price: 89.99,
    stock: 67,
    rating: 4.7,
    tags: ['coffee', 'automatic', 'programmable'],
  },
];

const userColumns: Column<UserData>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true, width: '80px' },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  {
    key: 'age',
    title: 'Age',
    dataIndex: 'age',
    sortable: true,
    align: 'right',
  },
  {
    key: 'department',
    title: 'Department',
    dataIndex: 'department',
    sortable: true,
  },
  {
    key: 'salary',
    title: 'Salary',
    dataIndex: 'salary',
    sortable: true,
    align: 'right',
  },
  {
    key: 'joinDate',
    title: 'Join Date',
    dataIndex: 'joinDate',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: value => (
      <span
        className={
          value === 'active'
            ? 'rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'
            : value === 'inactive'
              ? 'rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800'
              : 'rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800'
        }
      >
        {value}
      </span>
    ),
  },
];

const productColumns: Column<Product>[] = [
  { key: 'id', title: 'Product ID', dataIndex: 'id', width: '120px' },
  { key: 'name', title: 'Product Name', dataIndex: 'name', sortable: true },
  { key: 'category', title: 'Category', dataIndex: 'category', sortable: true },
  {
    key: 'price',
    title: 'Price',
    dataIndex: 'price',
    sortable: true,
    align: 'right',
    render: value => `$${value.toFixed(2)}`,
  },
  {
    key: 'stock',
    title: 'Stock',
    dataIndex: 'stock',
    sortable: true,
    align: 'right',
    render: value => (
      <span
        className={
          value > 50
            ? 'font-medium text-green-600'
            : value > 20
              ? 'font-medium text-yellow-600'
              : 'font-medium text-red-600'
        }
      >
        {value}
      </span>
    ),
  },
  {
    key: 'rating',
    title: 'Rating',
    dataIndex: 'rating',
    sortable: true,
    align: 'center',
    render: value => (
      <div className="flex items-center justify-center">
        <span className="text-yellow-500">★</span>
        <span className="ml-1 text-sm">{value}</span>
      </div>
    ),
  },
  {
    key: 'tags',
    title: 'Tags',
    dataIndex: 'tags',
    render: value => (
      <div className="flex flex-wrap gap-1">
        {value.map((tag: string) => (
          <span
            key={tag}
            className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
];

function App() {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    company: '',
    salary: '',
    joinDate: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DataTable state
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [userSortBy, setUserSortBy] = useState<string>('');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Demo state
  const [activeTab, setActiveTab] = useState<
    'inputfield' | 'datatable' | 'form' | 'responsive'
  >('inputfield');

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (
      formData.phone &&
      !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))
    ) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Please enter a valid URL';
    }

    if (
      formData.salary &&
      (parseFloat(formData.salary) < 0 || parseFloat(formData.salary) > 1000000)
    ) {
      errors.salary = 'Salary must be between 0 and 1,000,000';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert('Form submitted successfully!');
    setIsSubmitting(false);

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      website: '',
      company: '',
      salary: '',
      joinDate: '',
    });
    setFormErrors({});
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

  const handleUserSort = (column: string, order: 'asc' | 'desc') => {
    setUserSortBy(column);
    setUserSortOrder(order);
  };

  const handleUserRowClick = (user: UserData) => {
    alert(`Clicked on: ${user.name} (${user.department})`);
  };

  const handleProductRowClick = (product: Product) => {
    alert(`Clicked on: ${product.name} - $${product.price}`);
  };

  const filteredUsers = sampleUsers.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  Component Demo
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                React + TypeScript + TailwindCSS
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'inputfield', label: 'InputField', icon: UserIcon },
              { id: 'datatable', label: 'DataTable', icon: Users },
              { id: 'form', label: 'Form Integration', icon: Settings },
              { id: 'responsive', label: 'Responsive Demo', icon: Globe },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* InputField Demo */}
        {activeTab === 'inputfield' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                InputField Component
              </h2>
              <p className="text-lg text-gray-600">
                Professional input fields with multiple variants, sizes, and
                states
              </p>
            </div>

            {/* Variants */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Visual Variants
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            </section>

            {/* Sizes */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Sizes
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            </section>

            {/* Input Types */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Input Types
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <InputField
                  label="Text Input"
                  type="text"
                  placeholder="Enter any text"
                  showClearButton
                  helperText="Text input with clear button"
                />
              </div>
            </section>

            {/* States */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                States
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <InputField
                  label="Success State"
                  placeholder="Valid input"
                  helperText="This input is valid"
                  className="border-green-500 focus:border-green-500 focus:ring-green-200"
                />
              </div>
            </section>
          </div>
        )}

        {/* DataTable Demo */}
        {activeTab === 'datatable' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                DataTable Component
              </h2>
              <p className="text-lg text-gray-600">
                Professional data tables with sorting, selection, and responsive
                design
              </p>
            </div>

            {/* User Table */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  User Management
                </h3>
                <div className="flex items-center space-x-4">
                  <InputField
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    showClearButton
                    size="sm"
                    className="w-64"
                  />
                  <div className="text-sm text-gray-600">
                    Selected: {selectedUsers.length} users
                  </div>
                </div>
              </div>

              <DataTable
                data={filteredUsers}
                columns={userColumns}
                keyField="id"
                selectable="multiple"
                selectedRows={selectedUsers}
                onRowSelect={setSelectedUsers}
                sortBy={userSortBy}
                sortOrder={userSortOrder}
                onSort={handleUserSort}
                onRowClick={handleUserRowClick}
                striped
                hoverable
              />

              {selectedUsers.length > 0 && (
                <div className="mt-4 rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-2 font-medium text-blue-900">
                    Selected Users:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                      <span
                        key={user.id}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {user.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Product Table */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Product Catalog
                </h3>
                <div className="text-sm text-gray-600">
                  Selected: {selectedProducts.length} products
                </div>
              </div>

              <DataTable
                data={sampleProducts}
                columns={productColumns}
                keyField="id"
                selectable="multiple"
                selectedRows={selectedProducts}
                onRowSelect={setSelectedProducts}
                onRowClick={handleProductRowClick}
                striped
                hoverable
                size="lg"
              />
            </section>

            {/* Table States */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Table States
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">
                    Loading State
                  </h4>
                  <DataTable
                    data={[]}
                    columns={userColumns}
                    loading
                    keyField="id"
                  />
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">
                    Error State
                  </h4>
                  <DataTable
                    data={[]}
                    columns={userColumns}
                    error="Failed to load data. Please try again."
                    keyField="id"
                  />
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">
                    Empty State
                  </h4>
                  <DataTable data={[]} columns={userColumns} keyField="id" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Form Integration Demo */}
        {activeTab === 'form' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Form Integration
              </h2>
              <p className="text-lg text-gray-600">
                Complete form with validation, error handling, and professional
                styling
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <form
                onSubmit={handleSubmit}
                className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputField
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    placeholder="Enter your first name"
                    required
                    invalid={!!formErrors.firstName}
                    errorMessage={formErrors.firstName}
                    showClearButton
                  />

                  <InputField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    placeholder="Enter your last name"
                    required
                    invalid={!!formErrors.lastName}
                    errorMessage={formErrors.lastName}
                    showClearButton
                  />

                  <InputField
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="Enter your email address"
                    required
                    invalid={!!formErrors.email}
                    errorMessage={formErrors.email}
                    showClearButton
                    helperText="We'll never share your email with anyone else"
                  />

                  <InputField
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    placeholder="+1 (555) 123-4567"
                    invalid={!!formErrors.phone}
                    errorMessage={formErrors.phone}
                    helperText="Optional: International format supported"
                  />

                  <InputField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Enter your password"
                    required
                    invalid={!!formErrors.password}
                    errorMessage={formErrors.password}
                    showPasswordToggle
                    helperText="Must be at least 8 characters long"
                  />

                  <InputField
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="Confirm your password"
                    required
                    invalid={!!formErrors.confirmPassword}
                    errorMessage={formErrors.confirmPassword}
                    showPasswordToggle
                  />

                  <InputField
                    label="Company Website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange('website')}
                    placeholder="https://example.com"
                    invalid={!!formErrors.website}
                    errorMessage={formErrors.website}
                    helperText="Optional: Your company website"
                  />

                  <InputField
                    label="Company Name"
                    value={formData.company}
                    onChange={handleInputChange('company')}
                    placeholder="Enter your company name"
                    helperText="Optional: Your current employer"
                  />

                  <InputField
                    label="Expected Salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange('salary')}
                    placeholder="Enter expected salary"
                    invalid={!!formErrors.salary}
                    errorMessage={formErrors.salary}
                    helperText="Optional: Your salary expectations"
                  />

                  <InputField
                    label="Preferred Start Date"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleInputChange('joinDate')}
                    helperText="Optional: When you'd like to start"
                  />
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        phone: '',
                        website: '',
                        company: '',
                        salary: '',
                        joinDate: '',
                      });
                      setFormErrors({});
                    }}
                    className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Responsive Demo */}
        {activeTab === 'responsive' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Responsive Design
              </h2>
              <p className="text-lg text-gray-600">
                See how components adapt to different screen sizes
              </p>
            </div>

            {/* Responsive Input Fields */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Responsive Input Fields
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <InputField
                  label="Small Screen"
                  placeholder="Responsive input"
                  helperText="Adapts to screen size"
                />
                <InputField
                  label="Medium Screen"
                  placeholder="Responsive input"
                  helperText="Adapts to screen size"
                />
                <InputField
                  label="Large Screen"
                  placeholder="Responsive input"
                  helperText="Adapts to screen size"
                />
                <InputField
                  label="Extra Large"
                  placeholder="Responsive input"
                  helperText="Adapts to screen size"
                />
              </div>
            </section>

            {/* Responsive DataTable */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Responsive DataTable
              </h3>
              <div className="mb-4 text-sm text-gray-600">
                <p>Resize your browser window to see the table adapt:</p>
                <ul className="mt-2 list-inside list-disc">
                  <li>Mobile: Horizontal scroll with all columns</li>
                  <li>Tablet: Adaptive column display</li>
                  <li>Desktop: Full feature set</li>
                </ul>
              </div>

              <div className="mb-6 rounded-lg border border-gray-300 bg-gray-50 p-4">
                <h4 className="mb-2 font-medium">Mobile View (narrow width)</h4>
                <div className="w-80 overflow-hidden">
                  <DataTable
                    data={sampleUsers.slice(0, 3)}
                    columns={userColumns}
                    keyField="id"
                    size="sm"
                    striped
                  />
                </div>
              </div>

              <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                <h4 className="mb-2 font-medium">Desktop View (full width)</h4>
                <DataTable
                  data={sampleUsers}
                  columns={userColumns}
                  keyField="id"
                  striped
                  hoverable
                />
              </div>
            </section>

            {/* Error Handling Demo */}
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Error Handling Scenarios
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Input Field Errors
                  </h4>
                  <InputField
                    label="Invalid Email"
                    type="email"
                    value="invalid-email"
                    invalid
                    errorMessage="Please enter a valid email address"
                    showClearButton
                  />
                  <InputField
                    label="Required Field"
                    required
                    invalid
                    errorMessage="This field is required"
                  />
                  <InputField
                    label="Password Too Short"
                    type="password"
                    value="123"
                    invalid
                    errorMessage="Password must be at least 8 characters"
                    showPasswordToggle
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    DataTable Errors
                  </h4>
                  <DataTable
                    data={[]}
                    columns={userColumns}
                    error="Network error: Unable to load data"
                    keyField="id"
                  />
                  <DataTable
                    data={[]}
                    columns={userColumns}
                    loading
                    keyField="id"
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>
              Component Demo - Built with React, TypeScript, and TailwindCSS
            </p>
            <p className="mt-2 text-sm">
              Professional input fields and data tables with comprehensive
              features
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
