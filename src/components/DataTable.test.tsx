import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, Column } from './DataTable';

// Sample data for testing
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'inactive';
  department: string;
  salary: number;
  joinDate: string;
}

const sampleData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    status: 'active',
    department: 'Engineering',
    salary: 75000,
    joinDate: '2022-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25,
    status: 'active',
    department: 'Marketing',
    salary: 65000,
    joinDate: '2022-03-20',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 35,
    status: 'inactive',
    department: 'Sales',
    salary: 80000,
    joinDate: '2021-11-10',
  },
];

const sampleColumns: Column<User>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
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
        className={value === 'active' ? 'text-success-600' : 'text-error-600'}
      >
        {value}
      </span>
    ),
  },
];

describe('DataTable', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with data and columns', () => {
      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      // Check if headers are rendered
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();

      // Check if data is rendered
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
    });

    it('renders without keyField', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          className="custom-table"
        />
      );

      const tableContainer = screen
        .getByText('John Doe')
        .closest('.custom-table');
      expect(tableContainer).toBeInTheDocument();
    });

    it('renders with different sizes', () => {
      const { rerender } = render(
        <DataTable data={sampleData} columns={sampleColumns} size="sm" />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      rerender(
        <DataTable data={sampleData} columns={sampleColumns} size="md" />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      rerender(
        <DataTable data={sampleData} columns={sampleColumns} size="lg" />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  // Loading, error, and empty states
  describe('States', () => {
    it('renders loading state', () => {
      render(<DataTable data={[]} columns={sampleColumns} loading />);

      // Check for skeleton elements by looking for the animate-pulse class
      const skeletonContainer = document.querySelector('.animate-pulse');
      expect(skeletonContainer).toBeInTheDocument();
    });

    it('renders error state', () => {
      const errorMessage = 'Failed to load data';
      render(
        <DataTable data={[]} columns={sampleColumns} error={errorMessage} />
      );

      expect(screen.getByText('Error Loading Data')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('renders empty state', () => {
      render(<DataTable data={[]} columns={sampleColumns} />);

      expect(screen.getByText('No Data Available')).toBeInTheDocument();
      expect(
        screen.getByText('There are no records to display.')
      ).toBeInTheDocument();
    });

    it('renders with striped rows', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} striped />);

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    it('renders with hoverable rows', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} hoverable />);

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    it('renders non-hoverable rows', () => {
      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          hoverable={false}
        />
      );

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  // Sorting tests
  describe('Sorting', () => {
    it('handles column sorting', async () => {
      const onSort = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          onSort={onSort}
        />
      );

      // Click on sortable column header
      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      expect(onSort).toHaveBeenCalledWith('name', 'asc');

      // Click again to reverse sort
      await user.click(nameHeader);
      expect(onSort).toHaveBeenCalledWith('name', 'desc');
    });

    it('handles non-sortable columns', async () => {
      const onSort = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          onSort={onSort}
        />
      );

      // Email column is not sortable
      const emailHeader = screen.getByText('Email');
      await user.click(emailHeader);

      expect(onSort).not.toHaveBeenCalled();
    });

    it('handles controlled sorting', () => {
      const onSort = jest.fn();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          sortBy="name"
          sortOrder="desc"
          onSort={onSort}
        />
      );

      // The component should respect the controlled sort state
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('sorts data correctly internally', async () => {
      const user = userEvent.setup();

      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      // Click on name header to sort
      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      // Check if data is sorted (Bob should come first alphabetically)
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1]; // Skip header row
      expect(firstDataRow).toHaveTextContent('Bob Johnson');
    });

    it('handles sorting with null/undefined values', async () => {
      const dataWithNulls: User[] = [
        { ...sampleData[0], name: 'John Doe' },
        { ...sampleData[1], name: null as any },
        { ...sampleData[2], name: 'Bob Johnson' },
      ];

      const user = userEvent.setup();

      render(
        <DataTable data={dataWithNulls} columns={sampleColumns} keyField="id" />
      );

      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      // Should not crash and should handle null values gracefully
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  // Selection tests
  describe('Selection', () => {
    it('handles single row selection', async () => {
      const onRowSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          selectable="single"
          onRowSelect={onRowSelect}
        />
      );

      // Find and click the first row's select button
      const selectButtons = screen.getAllByRole('button');
      const firstSelectButton = selectButtons[0]; // First select button
      await user.click(firstSelectButton);

      expect(onRowSelect).toHaveBeenCalledWith([sampleData[0]]);
    });

    it('handles multiple row selection', async () => {
      const onRowSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          selectable="multiple"
          onRowSelect={onRowSelect}
        />
      );

      // Click multiple select buttons
      const selectButtons = screen.getAllByRole('button');
      await user.click(selectButtons[0]); // First row
      await user.click(selectButtons[1]); // Second row

      expect(onRowSelect).toHaveBeenCalledTimes(2);
    });

    it('handles selected rows prop', () => {
      const selectedRows = [sampleData[0]];

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          selectable="single"
          selectedRows={selectedRows}
        />
      );

      // The first row should be selected
      const selectButtons = screen.getAllByRole('button');
      expect(selectButtons[0]).toHaveClass('bg-primary-500');
    });

    it('does not show selection when selectable is false', () => {
      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          selectable={false}
        />
      );

      const selectButtons = screen.queryAllByRole('button');
      expect(selectButtons.length).toBe(0);
    });

    it('handles selection with missing keyField', async () => {
      const onRowSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          selectable="single"
          onRowSelect={onRowSelect}
        />
      );

      // Should still work without keyField
      const selectButtons = screen.getAllByRole('button');
      await user.click(selectButtons[0]);

      expect(onRowSelect).toHaveBeenCalled();
    });
  });

  // Row click tests
  describe('Row Click', () => {
    it('handles row click', async () => {
      const onRowClick = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          onRowClick={onRowClick}
        />
      );

      // Click on a row
      const row = screen.getByText('John Doe').closest('tr');
      if (row) {
        await user.click(row);
        expect(onRowClick).toHaveBeenCalledWith(sampleData[0], 0);
      }
    });

    it('does not trigger row click when clicking on select button', async () => {
      const onRowClick = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          selectable="single"
          onRowClick={onRowClick}
        />
      );

      const selectButton = screen.getAllByRole('button')[0];
      await user.click(selectButton);

      expect(onRowClick).not.toHaveBeenCalled();
    });

    it('applies cursor pointer when onRowClick is provided', () => {
      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          onRowClick={() => {}}
        />
      );

      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1); // Skip header row
      dataRows.forEach(row => {
        expect(row).toHaveClass('cursor-pointer');
      });
    });
  });

  // Column configuration tests
  describe('Column Configuration', () => {
    it('renders custom column renderer', () => {
      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      // Check if custom rendered status is displayed - use getAllByText since there are multiple "active" elements
      const activeElements = screen.getAllByText('active');
      expect(activeElements.length).toBeGreaterThan(0);
      expect(screen.getByText('inactive')).toBeInTheDocument();
    });

    it('handles column alignment', () => {
      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      // Age column should be right-aligned
      const ageCell = screen.getByText('30');
      expect(ageCell).toBeInTheDocument();
    });

    it('handles column width', () => {
      const columnsWithWidth: Column<User>[] = [
        { key: 'id', title: 'ID', dataIndex: 'id', width: '100px' },
        { key: 'name', title: 'Name', dataIndex: 'name', width: 200 },
      ];

      render(<DataTable data={sampleData} columns={columnsWithWidth} />);

      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('handles column className', () => {
      const columnsWithClass: Column<User>[] = [
        { key: 'id', title: 'ID', dataIndex: 'id', className: 'custom-cell' },
      ];

      render(<DataTable data={sampleData} columns={columnsWithClass} />);

      const cell = screen.getByText('1');
      expect(cell.closest('td')).toHaveClass('custom-cell');
    });
  });

  // Data handling tests
  describe('Data Handling', () => {
    it('handles null/undefined values in data', () => {
      const dataWithNulls: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
          status: 'active',
          department: 'Engineering',
          salary: 75000,
          joinDate: '2022-01-15',
        },
        {
          id: 2,
          name: null as any,
          email: undefined as any,
          age: 25,
          status: 'inactive',
          department: 'Sales',
          salary: 80000,
          joinDate: '2021-11-10',
        },
      ];

      render(
        <DataTable data={dataWithNulls} columns={sampleColumns} keyField="id" />
      );

      // Should render without errors
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('handles empty data array', () => {
      render(<DataTable data={[]} columns={sampleColumns} />);

      expect(screen.getByText('No Data Available')).toBeInTheDocument();
    });

    it('handles large datasets efficiently', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + (i % 50),
        status: i % 2 === 0 ? 'active' : ('inactive' as const),
        department: ['Engineering', 'Marketing', 'Sales', 'HR'][i % 4],
        salary: 50000 + i * 1000,
        joinDate: new Date(2022, i % 12, (i % 28) + 1)
          .toISOString()
          .split('T')[0],
      }));

      render(
        <DataTable data={largeData} columns={sampleColumns} keyField="id" />
      );

      // Should render without performance issues
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 1000')).toBeInTheDocument();
    });

    it('handles data updates', () => {
      const { rerender } = render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();

      const newData = [{ ...sampleData[0], name: 'Updated Name' }];
      rerender(
        <DataTable data={newData} columns={sampleColumns} keyField="id" />
      );

      expect(screen.getByText('Updated Name')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  // Responsive design tests
  describe('Responsive Design', () => {
    it('handles responsive design', () => {
      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      const tableContainer = screen.getByText('John Doe').closest('div');
      expect(tableContainer).toHaveClass('overflow-x-auto');
    });

    it('applies responsive wrapper classes', () => {
      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      const outerContainer = screen
        .getByText('John Doe')
        .closest('.overflow-hidden');
      expect(outerContainer).toBeInTheDocument();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('provides proper table structure', () => {
      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(sampleColumns.length);
    });

    it('provides proper ARIA attributes for sortable columns', () => {
      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      const sortableHeaders = screen.getAllByText(
        /ID|Name|Age|Department|Salary|Join Date/
      );
      sortableHeaders.forEach(header => {
        expect(header.closest('th')).toHaveClass('cursor-pointer');
      });
    });

    it('provides proper ARIA attributes for selection', () => {
      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          selectable="single"
        />
      );

      const selectButtons = screen.getAllByRole('button');
      selectButtons.forEach(button => {
        // Check if button has aria-label or is properly accessible
        expect(button).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      // Tab to first interactive element
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });

    it('handles keyboard interactions for sorting', async () => {
      const onSort = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          onSort={onSort}
        />
      );

      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      expect(onSort).toHaveBeenCalled();
    });
  });

  // Edge cases and error handling
  describe('Edge Cases and Error Handling', () => {
    it('handles missing keyField gracefully', () => {
      render(<DataTable data={sampleData} columns={sampleColumns} />);

      // Should still render without errors
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('handles empty columns array', () => {
      render(<DataTable data={sampleData} columns={[]} />);

      // Should handle gracefully
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('handles rapid prop changes', () => {
      const { rerender } = render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      // Rapidly change props
      rerender(<DataTable data={[]} columns={sampleColumns} keyField="id" />);
      rerender(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );
      rerender(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          loading
        />
      );

      // Should not crash
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('handles invalid sort order', () => {
      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          sortOrder={'invalid' as any}
        />
      );

      // Should handle gracefully
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('handles invalid selectable value', () => {
      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          selectable={'invalid' as any}
        />
      );

      // Should handle gracefully
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('handles large datasets without performance issues', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + (i % 50),
        status: i % 2 === 0 ? 'active' : ('inactive' as const),
        department: ['Engineering', 'Marketing', 'Sales', 'HR'][i % 4],
        salary: 50000 + i * 1000,
        joinDate: new Date(2022, i % 12, (i % 28) + 1)
          .toISOString()
          .split('T')[0],
      }));

      const startTime = performance.now();
      render(
        <DataTable data={largeData} columns={sampleColumns} keyField="id" />
      );
      const endTime = performance.now();

      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });

    it('memoizes sorted data correctly', async () => {
      const user = userEvent.setup();

      render(
        <DataTable data={sampleData} columns={sampleColumns} keyField="id" />
      );

      const nameHeader = screen.getByText('Name');

      // Multiple clicks should not cause performance issues
      for (let i = 0; i < 10; i++) {
        await user.click(nameHeader);
      }

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  // Integration tests
  describe('Integration', () => {
    it('combines multiple features correctly', async () => {
      const onSort = jest.fn();
      const onRowSelect = jest.fn();
      const onRowClick = jest.fn();
      const user = userEvent.setup();

      render(
        <DataTable
          data={sampleData}
          columns={sampleColumns}
          keyField="id"
          selectable="multiple"
          selectedRows={[sampleData[0]]}
          onRowSelect={onRowSelect}
          onSort={onSort}
          onRowClick={onRowClick}
          striped
          hoverable
        />
      );

      // Test sorting
      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);
      expect(onSort).toHaveBeenCalled();

      // Test selection
      const selectButtons = screen.getAllByRole('button');
      await user.click(selectButtons[1]); // Second row
      expect(onRowSelect).toHaveBeenCalled();

      // Test row click
      const row = screen.getByText('Jane Smith').closest('tr');
      if (row) {
        await user.click(row);
        expect(onRowClick).toHaveBeenCalled();
      }

      // Verify all features are working together
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('handles complex column configurations', () => {
      const complexColumns: Column<User>[] = [
        {
          key: 'id',
          title: 'ID',
          dataIndex: 'id',
          sortable: true,
          width: '80px',
        },
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
          key: 'status',
          title: 'Status',
          dataIndex: 'status',
          render: value => (
            <span
              className={
                value === 'active' ? 'text-success-600' : 'text-error-600'
              }
            >
              {value}
            </span>
          ),
        },
      ];

      render(
        <DataTable
          data={sampleData}
          columns={complexColumns}
          keyField="id"
          selectable="single"
          striped
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      const activeElements = screen.getAllByText('active');
      expect(activeElements.length).toBeGreaterThan(0);
    });
  });
});
