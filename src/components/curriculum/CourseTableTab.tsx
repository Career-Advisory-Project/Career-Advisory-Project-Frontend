"use no memo";
import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import type { Course } from "../../types/curriculum";

type CourseTableTabProps = {
  courses: Course[];
};

const CourseTableTab: React.FC<CourseTableTabProps> = ({ courses }) => {
const columns = useMemo<MRT_ColumnDef<Course>[]>(() => [
  {
    accessorKey: 'name',
    header: 'Course Name',
    grow: true,
  },
 {
  accessorKey: 'credit',
  header: 'Credit',
  size: 110,
  grow: false,
  muiTableHeadCellProps: {
    sx: {
      '& .Mui-TableHeadCell-Content-Wrapper': {
        justifyContent: 'flex-end',
        flex: 1,
      },
    }
  },
  muiTableBodyCellProps: { align: 'left' },
},
{
  accessorKey: 'recommendYear',
  header: 'Year',
  size: 110,
  grow: false,
  muiTableHeadCellProps: {
    sx: {
      '& .Mui-TableHeadCell-Content-Wrapper': {
        justifyContent: 'flex-end',
        flex: 1,
      },
    }
  },
  muiTableBodyCellProps: { align: 'left' },
},
], []);

  const table = useMaterialReactTable({
    columns,
    data: courses,
    enableColumnActions: false,
    enableColumnFilters: true,
    columnFilterDisplayMode: 'popover',
    enablePagination: true,
    enableSorting: true,
    enableHiding: false, 
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
        border: '1px solid #e0e0e0',
      },
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: '#f8f9fa',
      }
    },
    initialState: {
      density: 'compact',
    },
    layoutMode: 'grid',
  });

  return (
    <div className="w-full">
      <MaterialReactTable table={table} />
    </div>
  );
};

export default CourseTableTab;
