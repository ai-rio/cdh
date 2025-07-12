'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePayloadClient } from '@/lib/payload-client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Database, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  RefreshCw,
  Filter,
  Download,
  Upload
} from "lucide-react";
import { DynamicForm } from "./dynamic-form";
import { toast } from "sonner";

interface CollectionManagerProps {
  collection: string;
  title?: string;
  description?: string;
  className?: string;
}

interface CollectionField {
  name: string;
  type: string;
  label?: string;
  required?: boolean;
  admin?: {
    readOnly?: boolean;
    hidden?: boolean;
  };
}

interface CollectionConfig {
  slug: string;
  labels: {
    singular: string;
    plural: string;
  };
  fields: CollectionField[];
  admin?: {
    useAsTitle?: string;
    defaultColumns?: string[];
  };
}

export function CollectionManager({ 
  collection, 
  title, 
  description, 
  className 
}: CollectionManagerProps) {
  const payloadClient = usePayloadClient();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<CollectionConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Load collection configuration
  const loadConfig = useCallback(async () => {
    try {
      const configData = await payloadClient.getCollectionConfig(collection);
      setConfig(configData);
    } catch (err) {
      console.warn(`Could not load config for ${collection}, using defaults`);
      // Fallback configuration
      setConfig({
        slug: collection,
        labels: {
          singular: collection.slice(0, -1),
          plural: collection,
        },
        fields: [
          { name: 'id', type: 'number', label: 'ID' },
          { name: 'createdAt', type: 'date', label: 'Created' },
          { name: 'updatedAt', type: 'date', label: 'Updated' },
        ],
        admin: {
          useAsTitle: 'id',
          defaultColumns: ['id', 'createdAt', 'updatedAt'],
        },
      });
    }
  }, [collection, payloadClient]);

  // Load documents
  const loadDocuments = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    setError(null);

    try {
      const response = await payloadClient.getCollection(collection, {
        page,
        limit: 10,
        search: search || undefined,
        sort: '-createdAt',
      });

      setDocuments(response.docs);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
      toast.error('Failed to load data', {
        description: err.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  }, [collection, payloadClient]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    loadDocuments(1, term);
  }, [loadDocuments]);

  // Handle document creation
  const handleCreate = async (data: any) => {
    try {
      await payloadClient.createDocument(collection, data);
      toast.success('Document created successfully');
      setShowCreateDialog(false);
      loadDocuments(currentPage, searchTerm);
    } catch (err: any) {
      toast.error('Failed to create document', {
        description: err.message,
      });
    }
  };

  // Handle document update
  const handleUpdate = async (id: string | number, data: any) => {
    try {
      await payloadClient.updateDocument(collection, id, data);
      toast.success('Document updated successfully');
      setShowEditDialog(false);
      setSelectedDocument(null);
      loadDocuments(currentPage, searchTerm);
    } catch (err: any) {
      toast.error('Failed to update document', {
        description: err.message,
      });
    }
  };

  // Handle document deletion
  const handleDelete = async (id: string | number) => {
    try {
      await payloadClient.deleteDocument(collection, id);
      toast.success('Document deleted successfully');
      setShowDeleteDialog(false);
      setSelectedDocument(null);
      loadDocuments(currentPage, searchTerm);
    } catch (err: any) {
      toast.error('Failed to delete document', {
        description: err.message,
      });
    }
  };

  // Get display value for a field
  const getDisplayValue = (document: any, field: string) => {
    const value = document[field];
    
    if (value === null || value === undefined) return '-';
    
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object' && value.id) return `#${value.id}`;
    if (field.includes('At') && typeof value === 'string') {
      return new Date(value).toLocaleDateString();
    }
    
    return String(value);
  };

  // Get visible columns
  const visibleColumns = useMemo(() => {
    if (!config) return ['id'];
    
    if (config.admin?.defaultColumns) {
      return config.admin.defaultColumns;
    }
    
    // Default to first few fields
    return config.fields
      .filter(field => !field.admin?.hidden)
      .slice(0, 5)
      .map(field => field.name);
  }, [config]);

  // Initialize
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (config) {
      loadDocuments();
    }
  }, [config, loadDocuments]);

  if (!config) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {title || config.labels.plural}
              <Badge variant="secondary">{documents.length}</Badge>
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDocuments(currentPage, searchTerm)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {config.labels.singular}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${config.labels.plural.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Data Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.map((column) => (
                      <TableHead key={column}>
                        {config.fields.find(f => f.name === column)?.label || column}
                      </TableHead>
                    ))}
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell 
                        colSpan={visibleColumns.length + 1} 
                        className="text-center py-8"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Database className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No {config.labels.plural.toLowerCase()} found
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCreateDialog(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create {config.labels.singular}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((document) => (
                      <TableRow key={document.id}>
                        {visibleColumns.map((column) => (
                          <TableCell key={column}>
                            {getDisplayValue(document, column)}
                          </TableCell>
                        ))}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDocument(document);
                                  // View logic here
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDocument(document);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDocument(document);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => {
                      const newPage = currentPage - 1;
                      setCurrentPage(newPage);
                      loadDocuments(newPage, searchTerm);
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      const newPage = currentPage + 1;
                      setCurrentPage(newPage);
                      loadDocuments(newPage, searchTerm);
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create {config.labels.singular}</DialogTitle>
              <DialogDescription>
                Add a new {config.labels.singular.toLowerCase()} to the collection.
              </DialogDescription>
            </DialogHeader>
            {config.fields && (
              <DynamicForm
                fields={config.fields}
                onSubmit={handleCreate}
                onCancel={() => setShowCreateDialog(false)}
                submitLabel={`Create ${config.labels.singular}`}
                isLoading={loading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit {config.labels.singular}</DialogTitle>
              <DialogDescription>
                Update the {config.labels.singular.toLowerCase()} information.
              </DialogDescription>
            </DialogHeader>
            {config.fields && selectedDocument && (
              <DynamicForm
                fields={config.fields}
                initialData={selectedDocument}
                onSubmit={(data) => handleUpdate(selectedDocument.id, data)}
                onCancel={() => {
                  setShowEditDialog(false);
                  setSelectedDocument(null);
                }}
                submitLabel={`Update ${config.labels.singular}`}
                isLoading={loading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete {config.labels.singular}</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {config.labels.singular.toLowerCase()}? 
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedDocument && handleDelete(selectedDocument.id)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default CollectionManager;
