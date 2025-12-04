'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Database,
  HardDrive,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Server,
  Activity,
  Clock,
  FileText,
  Database as DatabaseIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TableInfo {
  name: string;
  rows: number;
  size: string;
  lastModified: string;
}

const mockTables: TableInfo[] = [
  { name: 'auth_user', rows: 1247, size: '2.4 MB', lastModified: '2 hours ago' },
  { name: 'rbac_userrole', rows: 1847, size: '1.8 MB', lastModified: '3 hours ago' },
  { name: 'rbac_rolehistory', rows: 3421, size: '4.2 MB', lastModified: '1 day ago' },
  { name: 'payments_wallettransaction', rows: 5632, size: '8.7 MB', lastModified: '5 hours ago' },
  { name: 'payments_paymenttransaction', rows: 4821, size: '6.3 MB', lastModified: '6 hours ago' },
  { name: 'payments_walletbalance', rows: 1247, size: '1.1 MB', lastModified: '7 hours ago' },
  { name: 'questions_question', rows: 12847, size: '45.2 MB', lastModified: '1 day ago' },
  { name: 'questions_mcqoption', rows: 51388, size: '12.4 MB', lastModified: '1 day ago' },
  { name: 'questions_tag', rows: 342, size: '124 KB', lastModified: '3 days ago' },
  { name: 'questions_category', rows: 87, size: '48 KB', lastModified: '5 days ago' },
];

interface BackupInfo {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed';
}

const mockBackups: BackupInfo[] = [
  {
    id: '1',
    name: 'backup_2025_12_04_10_30.sql',
    size: '127.4 MB',
    date: '2025-12-04 10:30 AM',
    type: 'auto',
    status: 'completed',
  },
  {
    id: '2',
    name: 'backup_2025_12_03_10_30.sql',
    size: '124.8 MB',
    date: '2025-12-03 10:30 AM',
    type: 'auto',
    status: 'completed',
  },
  {
    id: '3',
    name: 'backup_manual_2025_12_02.sql',
    size: '122.1 MB',
    date: '2025-12-02 03:15 PM',
    type: 'manual',
    status: 'completed',
  },
  {
    id: '4',
    name: 'backup_2025_12_01_10_30.sql',
    size: '118.7 MB',
    date: '2025-12-01 10:30 AM',
    type: 'auto',
    status: 'completed',
  },
  {
    id: '5',
    name: 'backup_2025_11_30_10_30.sql',
    size: '115.2 MB',
    date: '2025-11-30 10:30 AM',
    type: 'auto',
    status: 'failed',
  },
];

export function AdminDatabase() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isVacuuming, setIsVacuuming] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  // Database stats
  const totalSize = '198.7 MB';
  const totalRows = 83421;
  const totalTables = 45;
  const storageUsed = 42;
  const lastBackup = '4 hours ago';
  const dbVersion = 'PostgreSQL 15.3';

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success('Database optimized successfully');
    } catch (error) {
      toast.error('Failed to optimize database');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      toast.success('Database backup created successfully');
    } catch (error) {
      toast.error('Failed to create backup');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleVacuum = async () => {
    setIsVacuuming(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      toast.success('Database vacuumed successfully');
    } catch (error) {
      toast.error('Failed to vacuum database');
    } finally {
      setIsVacuuming(false);
    }
  };

  const handleDownloadBackup = (backupId: string, backupName: string) => {
    toast.success(`Downloading ${backupName}`);
    // Implement actual download logic
  };

  const handleDeleteBackup = () => {
    if (selectedBackup) {
      toast.success('Backup deleted successfully');
      setShowDeleteDialog(false);
      setSelectedBackup(null);
    }
  };

  const confirmDelete = (backupId: string) => {
    setSelectedBackup(backupId);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Management
          </h1>
          <p className="text-muted-foreground mt-1">Monitor, optimize, and backup your database</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Server className="h-3 w-3 mr-1" />
          {dbVersion}
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSize}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {storageUsed}% of allocated space
            </p>
            <Progress value={storageUsed} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRows.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {totalTables} tables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastBackup}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto backup at 10:30 AM daily
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Healthy
            </div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Database operations may temporarily affect performance. Schedule maintenance during off-peak hours.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tables" className="gap-2">
            <FileText className="h-4 w-4" />
            Tables
          </TabsTrigger>
          <TabsTrigger value="backups" className="gap-2">
            <Database className="h-4 w-4" />
            Backups
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Tables Tab */}
        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>
                Overview of all tables in the database with row counts and sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Table Name</th>
                        <th className="text-right p-4 font-medium">Rows</th>
                        <th className="text-right p-4 font-medium">Size</th>
                        <th className="text-right p-4 font-medium">Last Modified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTables.map((table, index) => (
                        <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="p-4 font-mono text-xs">{table.name}</td>
                          <td className="text-right p-4">{table.rows.toLocaleString()}</td>
                          <td className="text-right p-4">{table.size}</td>
                          <td className="text-right p-4 text-muted-foreground">
                            {table.lastModified}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Database Backups</CardTitle>
                  <CardDescription>Manage and restore database backups</CardDescription>
                </div>
                <Button onClick={handleBackup} disabled={isBackingUp}>
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Create Backup
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBackups.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          backup.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {backup.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium font-mono text-sm">{backup.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{backup.size}</span>
                          <span>•</span>
                          <span>{backup.date}</span>
                          <Badge variant="outline" className="text-xs">
                            {backup.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {backup.status === 'completed' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadBackup(backup.id, backup.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(backup.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restore from Backup</CardTitle>
              <CardDescription>Upload and restore a database backup file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">Drop backup file here or click to browse</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supports .sql, .dump files (max 500MB)
                </p>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Select Backup File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Optimization</CardTitle>
              <CardDescription>
                Optimize database performance and reclaim unused space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Optimize Tables</h4>
                    <p className="text-sm text-muted-foreground">
                      Reorganize table data and rebuild indexes for better performance
                    </p>
                  </div>
                  <Button onClick={handleOptimize} disabled={isOptimizing}>
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Optimize Now
                      </>
                    )}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last optimized: 2 days ago
                </div>
              </div>

              <div className="rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Vacuum Database</h4>
                    <p className="text-sm text-muted-foreground">
                      Clean up dead tuples and reclaim storage space
                    </p>
                  </div>
                  <Button onClick={handleVacuum} disabled={isVacuuming} variant="outline">
                    {isVacuuming ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Vacuuming...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Vacuum Now
                      </>
                    )}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">Last vacuumed: 1 day ago</div>
              </div>

              <div className="rounded-lg border p-6 bg-muted/30">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Important Notes</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Optimization may take several minutes depending on database size</li>
                      <li>Database performance may be temporarily affected during maintenance</li>
                      <li>It's recommended to create a backup before running maintenance tasks</li>
                      <li>Schedule maintenance during off-peak hours for minimal impact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this backup? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBackup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
