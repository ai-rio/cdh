'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Plus, 
  Search, 
  Filter, 
  Settings, 
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Loader2,
  Database,
  Eye,
  Edit,
  Users,
  FileText,
  TrendingUp
} from "lucide-react";

// Import hooks and components
import { useCollectionManager } from '@/app/(dashboard)/hooks/use-collection-manager';
import { useCollectionSchema } from '@/app/(dashboard)/hooks/use-collection-schema';
import { CollectionTable } from './collection-manager/collection-table';
import { BulkActions } from './collection-manager/bulk-actions';
import { EnhancedDynamicForm } from './enhanced-dynamic-form';
import type { Where, ImportOptions } from '@/types';

interface EnhancedCollectionManagerProps {
  collection: string;
  title?: string;
  description?: string;
  className?: string;
  enableCollaboration?: boolean;
  enableAnalytics?: boolean;
  enableAutoSave?: boolean;
  defaultPageSize?: number;
}

type ViewMode = 'list' | 'create' | 'edit' | 'view' | 'analytics';

export function EnhancedCollectionManager({
  collection,
  title,
  description,
  className,
  enableCollaboration = true,
  enableAnalytics = true,
  enableAutoSave = true,
  defaultPageSize = 25
}: EnhancedCollectionManagerProps) {
  // State
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Where>({});
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Hooks
  const collectionManager = useCollectionManager({
    collection,
    initialPageSize: defaultPageSize,
    enableRealTime: enableCollaboration,
    enableAnalytics
  });

  const schemaManager = useCollectionSchema({
    collection
  });

  // Destructure for easier access
  const {
    documents,
    totalCount,
    isLoading,
    error,
    currentPage,
    totalPages,
    pageSize,
    selectedIds,
    setSelectedIds,
    create,
    update,
    delete: deleteDocument,
    bulkDelete,
    bulkUpdate,
    bulkExport,
    search,
    filter,
    sort,
    sortField,
    sortDirection,
    goToPage,
    changePageSize,
    refresh,
    getCollectionStats
  } = collectionManager;

  const { schema, fields } = schemaManager;

  // Computed values
  const collectionLabel = schema?.labels?.plural || collection;
  const singularLabel = schema?.labels?.singular || collection.slice(0, -1);

  // Event handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    search(term);
  }, [search]);

  const handleFilter = useCallback((newFilters: Where) => {
    setFilters(newFilters);
    filter({ where: newFilters });
  }, [filter]);

  const handleCreate = useCallback(async (data: any) => {
    try {
      await create(data);
      setCurrentView('list');
    } catch (error) {
      console.error('Create failed:', error);
    }
  }, [create]);

  const handleEdit = useCallback((document: any) => {
    setSelectedDocument(document);
    setCurrentView('edit');
  }, []);

  const handleUpdate = useCallback(async (data: any) => {
    if (!selectedDocument) return;
    
    try {
      await update(selectedDocument.id, data);
      setCurrentView('list');
      setSelectedDocument(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  }, [update, selectedDocument]);

  const handleView = useCallback((document: any) => {
    setSelectedDocument(document);
    setCurrentView('view');
  }, []);

  const handleDelete = useCallback(async (document: any) => {
    try {
      await deleteDocument(document.id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [deleteDocument]);

  const handleDuplicate = useCallback(async (document: any) => {
    try {
      const { id, createdAt, updatedAt, ...duplicateData } = document;
      await create(duplicateData);
    } catch (error) {
      console.error('Duplicate failed:', error);
    }
  }, [create]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    try {
      await bulkDelete(ids);
      setSelectedIds([]);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  }, [bulkDelete, setSelectedIds]);

  const handleBulkExport = useCallback(async (ids: string[], format: 'csv' | 'json' | 'xlsx') => {
    try {
      const blob = await bulkExport(filters, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${collection}-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Bulk export failed:', error);
    }
  }, [bulkExport, filters, collection]);

  // Analytics data
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadStats = useCallback(async () => {
    if (!enableAnalytics) return;
    
    try {
      setStatsLoading(true);
      const collectionStats = await getCollectionStats();
      setStats(collectionStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [getCollectionStats, enableAnalytics]);

  // Quick stats display
  const quickStats = useMemo(() => [
    {
      label: 'Total Records',
      value: totalCount,
      icon: Database,
      change: stats?.creationTrends?.[0]?.value || 0
    },
    {
      label: 'Recent Activity',
      value: stats?.updateFrequency?.slice(-7).reduce((sum: number, day: any) => sum + day.value, 0) || 0,
      icon: TrendingUp,
      change: 0
    },
    {
      label: 'Storage Used',
      value: stats?.storageUsage?.totalSize ? `${Math.round(stats.storageUsage.totalSize / 1024)}KB` : '—',
      icon: FileText,
      change: 0
    },
    {
      label: 'Collaborators',
      value: enableCollaboration ? '—' : 0,
      icon: Users,
      change: 0
    }
  ], [totalCount, stats, enableCollaboration]);

  // Render different views
  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create {singularLabel}</h2>
                <p className="text-muted-foreground">Add a new {singularLabel.toLowerCase()} to the collection</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView('list')}>
                Back to List
              </Button>
            </div>
            <Separator />
            {fields && (
              <EnhancedDynamicForm
                fields={fields}
                onSubmit={handleCreate}
                onCancel={() => setCurrentView('list')}
                submitLabel={`Create ${singularLabel}`}
                isLoading={isLoading}
                collection={collection}
                enableCollaboration={enableCollaboration}
                enableAutoSave={enableAutoSave}
              />
            )}
          </div>
        );

      case 'edit':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit {singularLabel}</h2>
                <p className="text-muted-foreground">Update {singularLabel.toLowerCase()} information</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView('list')}>
                Back to List
              </Button>
            </div>
            <Separator />
            {fields && selectedDocument && (
              <EnhancedDynamicForm
                fields={fields}
                initialData={selectedDocument}
                onSubmit={handleUpdate}
                onCancel={() => setCurrentView('list')}
                submitLabel={`Update ${singularLabel}`}
                isLoading={isLoading}
                collection={collection}
                documentId={selectedDocument.id}
                enableCollaboration={enableCollaboration}
                enableAutoSave={enableAutoSave}
              />
            )}
          </div>
        );

      case 'view':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">View {singularLabel}</h2>
                <p className="text-muted-foreground">{singularLabel} details</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(selectedDocument)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={() => setCurrentView('list')}>
                  Back to List
                </Button>
              </div>
            </div>
            <Separator />
            {fields && selectedDocument && (
              <EnhancedDynamicForm
                fields={fields}
                initialData={selectedDocument}
                onSubmit={() => {}} // Read-only
                showPreview={true}
                isLoading={isLoading}
                collection={collection}
                documentId={selectedDocument.id}
                enableCollaboration={false} // Read-only mode
              />
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Analytics</h2>
                <p className="text-muted-foreground">Collection insights and statistics</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadStats} disabled={statsLoading}>
                  {statsLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Refresh
                </Button>
                <Button variant="outline" onClick={() => setCurrentView('list')}>
                  Back to List
                </Button>
              </div>
            </div>
            <Separator />
            
            {/* Analytics content would go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <stat.icon className="h-8 w-8 text-muted-foreground" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {statsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading analytics...
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Advanced analytics and reporting features would be implemented here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default: // 'list'
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{title || collectionLabel}</h1>
                {description && <p className="text-muted-foreground mt-1">{description}</p>}
              </div>
              <div className="flex items-center gap-2">
                {enableAnalytics && (
                  <Button variant="outline" onClick={() => setCurrentView('analytics')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                )}
                <Button onClick={() => setCurrentView('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add {singularLabel}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.slice(0, 4).map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="ml-3">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-xl font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${collectionLabel.toLowerCase()}...`}
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsImportDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkExport([], 'csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={refresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <BulkActions
                selectedCount={selectedIds.length}
                selectedIds={selectedIds}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkDuplicate={async (ids) => {
                  for (const id of ids) {
                    const doc = documents.find(d => d.id === id);
                    if (doc) await handleDuplicate(doc);
                  }
                }}
                isLoading={isLoading}
              />
            )}

            {/* Data Table */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {collectionLabel}
                      <Badge variant="secondary" className="ml-2">
                        {totalCount}
                      </Badge>
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {fields && (
                  <CollectionTable
                    data={documents}
                    fields={fields}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onDuplicate={handleDuplicate}
                    isLoading={isLoading}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={sort}
                  />
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => goToPage(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    const page = index + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => goToPage(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => goToPage(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive">{error.message || 'An error occurred'}</p>
          </CardContent>
        </Card>
      )}
      
      {renderContent()}
      
      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import {collectionLabel}</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2" />
            <p>Import functionality would be implemented here</p>
            <p className="text-sm">Support for CSV, JSON, and Excel formats</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EnhancedCollectionManager;