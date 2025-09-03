import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DataTable, Column } from './DataTable';

// Sample data types
interface User {
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
  description: string;
}

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A professional data table component with comprehensive features for displaying and interacting with tabular data.

## Features
- Flexible column configuration with custom renderers
- Column sorting (ascending/descending)
- Row selection (single/multiple/none)
- Loading states with skeleton loader
- Empty state with proper messaging
- Responsive design (mobile scroll, adaptive columns)
- Error handling and edge cases
- Performance optimized for large datasets

## Usage
The DataTable component accepts generic data types and provides a flexible API for customizing
column behavior, sorting, selection, and rendering.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the table elements',
    },
    striped: {
      control: { type: 'boolean' },
      description: 'Whether to show striped rows',
    },
    hoverable: {
      control: { type: 'boolean' },
      description: 'Whether rows show hover effects',
    },
    selectable: {
      control: { type: 'select' },
      options: [false, 'single', 'multiple'],
      description: 'Row selection mode',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows loading skeleton',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message to display',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleUsers: User[] = [
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
    description: 'High-quality wireless headphones with noise cancellation',
  },
  {
    id: 'PROD-002',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 299.99,
    stock: 23,
    rating: 4.2,
    tags: ['smartwatch', 'fitness', 'health'],
    description: 'Feature-rich smartwatch with health monitoring',
  },
  {
    id: 'PROD-003',
    name: 'Coffee Maker',
    category: 'Home & Kitchen',
    price: 89.99,
    stock: 67,
    rating: 4.7,
    tags: ['coffee', 'automatic', 'programmable'],
    description: 'Automatic coffee maker with programmable settings',
  },
];

// Sample columns
const userColumns: Column<User>[] = [
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

// Basic data display
export const Basic: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
    keyField: 'id',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic table displaying user data with sortable columns and status indicators.',
      },
    },
  },
};

// Sortable columns
export const Sortable: Story = {
  render: () => {
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSort = (column: string, order: 'asc' | 'desc') => {
      setSortBy(column);
      setSortOrder(order);
    };

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>
            Current sort: {sortBy} ({sortOrder})
          </p>
          <p>Click on column headers to sort</p>
        </div>
        <DataTable
          data={sampleUsers}
          columns={userColumns}
          keyField="id"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          striped
          hoverable
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive table with column sorting. Click on sortable column headers to change sort order.',
      },
    },
  },
};

// Selectable rows
export const Selectable: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>(
      'multiple'
    );

    const handleRowSelect = (rows: User[]) => {
      setSelectedRows(rows);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={selectionMode === 'single'}
              onChange={() => setSelectionMode('single')}
            />
            Single Selection
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={selectionMode === 'multiple'}
              onChange={() => setSelectionMode('multiple')}
            />
            Multiple Selection
          </label>
        </div>

        <div className="text-sm text-gray-600">
          <p>Selected rows: {selectedRows.length}</p>
          {selectedRows.length > 0 && (
            <p>Selected: {selectedRows.map(row => row.name).join(', ')}</p>
          )}
        </div>

        <DataTable
          data={sampleUsers}
          columns={userColumns}
          keyField="id"
          selectable={selectionMode}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          striped
          hoverable
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Table with row selection. Toggle between single and multiple selection modes.',
      },
    },
  },
};

// States showcase
export const States: Story = {
  render: () => {
    const [currentState, setCurrentState] = useState<
      'data' | 'loading' | 'error' | 'empty'
    >('data');

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentState('data')}
            className={`rounded px-3 py-1 ${
              currentState === 'data' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Data
          </button>
          <button
            onClick={() => setCurrentState('loading')}
            className={`rounded px-3 py-1 ${
              currentState === 'loading'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            Loading
          </button>
          <button
            onClick={() => setCurrentState('error')}
            className={`rounded px-3 py-1 ${
              currentState === 'error'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            Error
          </button>
          <button
            onClick={() => setCurrentState('empty')}
            className={`rounded px-3 py-1 ${
              currentState === 'empty'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            Empty
          </button>
        </div>

        <DataTable
          data={currentState === 'data' ? sampleUsers : []}
          columns={userColumns}
          keyField="id"
          loading={currentState === 'loading'}
          error={
            currentState === 'error'
              ? 'Failed to load data. Please try again.'
              : undefined
          }
          striped
          hoverable
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Different table states: data display, loading skeleton, error message, and empty state.',
      },
    },
  },
};

// Responsive design
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        <p>Resize your browser window to see responsive behavior:</p>
        <ul className="mt-2 list-inside list-disc">
          <li>Mobile: Horizontal scroll with all columns</li>
          <li>Tablet: Adaptive column display</li>
          <li>Desktop: Full feature set</li>
        </ul>
      </div>

      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
        <h4 className="mb-2 font-medium">Mobile View (narrow width)</h4>
        <div className="w-80 overflow-hidden">
          <DataTable
            data={sampleUsers}
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
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Responsive table design that adapts to different screen sizes with horizontal scroll on mobile.',
      },
    },
  },
};

// Complex data with custom renderers
export const ComplexData: Story = {
  render: () => {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    const handleRowSelect = (rows: Product[]) => {
      setSelectedProducts(rows);
    };

    const handleRowClick = (product: Product) => {
      alert(`Clicked on: ${product.name} - $${product.price}`);
    };

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>
            Complex product data with custom renderers, selection, and row
            clicks.
          </p>
          {selectedProducts.length > 0 && (
            <p>Selected: {selectedProducts.map(p => p.name).join(', ')}</p>
          )}
        </div>

        <DataTable
          data={sampleProducts}
          columns={productColumns}
          keyField="id"
          selectable="multiple"
          selectedRows={selectedProducts}
          onRowSelect={handleRowSelect}
          onRowClick={handleRowClick}
          striped
          hoverable
          size="lg"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complex data table with nested objects, custom renderers, and interactive features.',
      },
    },
  },
};

// Large dataset performance
export const LargeDataset: Story = {
  render: () => {
    // Generate large dataset
    const largeData: User[] = Array.from({ length: 1000 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      age: 20 + (index % 50),
      department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][
        index % 5
      ],
      salary: 50000 + (index % 100000),
      joinDate: new Date(2020 + (index % 4), index % 12, (index % 28) + 1)
        .toISOString()
        .split('T')[0],
      status: ['active', 'inactive', 'pending'][index % 3] as User['status'],
    }));

    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSort = (column: string, order: 'asc' | 'desc') => {
      setSortBy(column);
      setSortOrder(order);
    };

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>
            Performance test with 1,000 rows. Sorting and rendering should
            remain smooth.
          </p>
          <p>
            Current sort: {sortBy} ({sortOrder})
          </p>
        </div>

        <DataTable
          data={largeData}
          columns={userColumns}
          keyField="id"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          striped
          hoverable
          size="sm"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Performance demonstration with 1,000 rows. Tests sorting and rendering performance.',
      },
    },
  },
};

// Interactive example with all features
export const Interactive: Story = {
  render: () => {
    const [data, setData] = useState(sampleUsers);
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (column: string, order: 'asc' | 'desc') => {
      setSortBy(column);
      setSortOrder(order);
    };

    const handleRowSelect = (rows: User[]) => {
      setSelectedRows(rows);
    };

    const handleRowClick = (user: User) => {
      alert(`Clicked on: ${user.name} (${user.department})`);
    };

    const filteredData = data.filter(
      user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addRandomUser = () => {
      const newUser: User = {
        id: Math.max(...data.map(u => u.id)) + 1,
        name: `User ${Math.floor(Math.random() * 1000)}`,
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        age: 20 + Math.floor(Math.random() * 40),
        department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][
          Math.floor(Math.random() * 5)
        ],
        salary: 50000 + Math.floor(Math.random() * 100000),
        joinDate: new Date().toISOString().split('T')[0],
        status: ['active', 'inactive', 'pending'][
          Math.floor(Math.random() * 3)
        ] as User['status'],
      };
      setData([...data, newUser]);
    };

    const removeSelected = () => {
      if (selectedRows.length > 0) {
        setData(
          data.filter(
            user => !selectedRows.find(selected => selected.id === user.id)
          )
        );
        setSelectedRows([]);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <button
            onClick={addRandomUser}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Add User
          </button>
          <button
            onClick={removeSelected}
            disabled={selectedRows.length === 0}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            Remove Selected ({selectedRows.length})
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            Total users: {data.length} | Filtered: {filteredData.length} |
            Selected: {selectedRows.length}
          </p>
          {selectedRows.length > 0 && (
            <p>Selected: {selectedRows.map(row => row.name).join(', ')}</p>
          )}
        </div>

        <DataTable
          data={filteredData}
          columns={userColumns}
          keyField="id"
          selectable="multiple"
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={handleRowClick}
          striped
          hoverable
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive table demonstrating all features: search, add/remove users, selection, sorting, and row clicks.',
      },
    },
  },
};
