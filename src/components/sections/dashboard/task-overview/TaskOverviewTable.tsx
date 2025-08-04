import { useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import ActionMenu from './ActionMenu';
import dayjs from 'dayjs';
import NoRowsOverlay from 'components/common/NoRowsOverlay';

interface TaskRow {
  _id: string;
  title: string;
  progress: number;
  status: string;
  dueDate: string;
  photo?: string;
  memberId?: string[] | { id: string | number; avatar: string }[];
  mentorId?: string;
}

interface TaskOverviewTableProps {
  searchText: string;
  initialState?: {
    pagination: { paginationModel: { pageSize: number } };
  };
  pageSize?: number;
  rows: TaskRow[];
  onEdit?: (row: TaskRow) => void;
  onRemove?: (row: TaskRow) => void;
  loading?: boolean;
}

const TaskOverviewTable = ({
  searchText,
  initialState,
  pageSize = 5,
  rows,
  onEdit,
  onRemove,
  loading = false,
}: TaskOverviewTableProps) => {
  const apiRef = useGridApiRef<GridApi>();

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Task',
      editable: false,
      align: 'left',
      flex: 2,
      minWidth: 220,
    },
    {
      field: 'memberId',
      headerName: 'Members',
      editable: false,
      sortable: false,
      align: 'left',
      flex: 2,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Stack height={1} alignItems="center">
            <AvatarGroup max={5}>
              {(params.value || []).map(
                (member: { id: string | number; avatar: string }, index: number) => (
                  <Avatar key={`${member.id}-${index}`} alt="avatar_img" src={member.avatar} />
                ),
              )}
            </AvatarGroup>
          </Stack>
        );
      },
    },
    {
      field: 'progress',
      headerName: 'Progress',
      editable: false,
      align: 'left',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Stack alignItems="center" gap={1} pr={2} height={1} width={1}>
            <Typography variant="body2" minWidth={40}>
              {params.value}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={params.value}
              sx={{
                width: 1,
                height: 5,
                borderRadius: 4,
              }}
            />
          </Stack>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      editable: false,
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const color =
          params.value === 'in progress'
            ? 'primary'
            : params.value === 'completed'
              ? 'success'
              : params.value === 'pending'
                ? 'warning'
                : 'info';
        return (
          <Stack direction="column" alignItems="center" justifyContent="center" height={1}>
            <Chip label={params.value} size="small" color={color} />
          </Stack>
        );
      },
    },
    {
      field: 'dueDate',
      headerName: 'Time Left',
      headerAlign: 'right',
      align: 'right',
      editable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const due = dayjs(params.value).startOf('day');
        const now = dayjs().startOf('day');
        const diff = due.diff(now, 'day');
        if (diff < 0) return 'Overdue';
        if (diff === 0) return 'Today';
        return `${diff} Day${diff > 1 ? 's' : ''}`;
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'right',
      align: 'right',
      editable: false,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <ActionMenu
          onEdit={onEdit ? () => onEdit(params.row) : undefined}
          onRemove={onRemove ? () => onRemove(params.row) : undefined}
        />
      ),
    },
  ];

  useEffect(() => {
    apiRef.current.setQuickFilterValues(searchText.split(/\b\W+\b/).filter((word) => word !== ''));
  }, [searchText]);

  // If initialState is not provided, use pageSize for default
  const effectiveInitialState = initialState || {
    pagination: { paginationModel: { pageSize } },
  };

  return (
    <DataGrid
      apiRef={apiRef}
      density="standard"
      columns={columns}
      rows={rows}
      rowHeight={60}
      disableColumnResize
      disableColumnMenu
      disableColumnSelector
      disableRowSelectionOnClick
      initialState={effectiveInitialState}
      autosizeOptions={{
        includeOutliers: true,
        includeHeaders: false,
        outliersFactor: 1,
        expand: true,
      }}
      slots={{
        pagination: DataGridFooter,
        noRowsOverlay: () => <NoRowsOverlay message="No any task" />,
        loadingOverlay: () => (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="200px"
            width="100%"
          >
            <CircularProgress />
          </Box>
        ),
      }}
      checkboxSelection
      pageSizeOptions={[5, 10, 20]}
      getRowId={(row) => row._id}
      loading={loading}
    />
  );
};

export default TaskOverviewTable;
