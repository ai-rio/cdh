'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Trash2, 
  Edit, 
  Download, 
  Upload,
  Copy,
  Archive,
  Eye,
  EyeOff,
  ChevronDown,
  Loader2
} from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkEdit?: (ids: string[]) => void;
  onBulkExport?: (ids: string[], format: 'csv' | 'json' | 'xlsx') => Promise<void>;
  onBulkDuplicate?: (ids: string[]) => Promise<void>;
  onBulkArchive?: (ids: string[]) => Promise<void>;
  onBulkPublish?: (ids: string[]) => Promise<void>;
  onBulkUnpublish?: (ids: string[]) => Promise<void>;
  selectedIds: string[];
  isLoading?: boolean;
  disabled?: boolean;
}

export function BulkActions({
  selectedCount,
  onBulkDelete,
  onBulkEdit,
  onBulkExport,
  onBulkDuplicate,
  onBulkArchive,
  onBulkPublish,
  onBulkUnpublish,
  selectedIds,
  isLoading = false,
  disabled = false
}: BulkActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleBulkDelete = async () => {
    if (!onBulkDelete) return;
    
    try {
      await onBulkDelete(selectedIds);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };

  const handleBulkExport = async (format: 'csv' | 'json' | 'xlsx') => {
    if (!onBulkExport) return;
    
    try {
      setIsExporting(true);
      await onBulkExport(selectedIds, format);
    } catch (error) {
      console.error('Bulk export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkDuplicate = async () => {
    if (!onBulkDuplicate) return;
    
    try {
      setIsDuplicating(true);
      await onBulkDuplicate(selectedIds);
    } catch (error) {
      console.error('Bulk duplicate failed:', error);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleBulkArchive = async () => {
    if (!onBulkArchive) return;
    
    try {
      setIsArchiving(true);
      await onBulkArchive(selectedIds);
    } catch (error) {
      console.error('Bulk archive failed:', error);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleBulkPublish = async () => {
    if (!onBulkPublish) return;
    
    try {
      setIsPublishing(true);
      await onBulkPublish(selectedIds);
    } catch (error) {
      console.error('Bulk publish failed:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBulkUnpublish = async () => {
    if (!onBulkUnpublish) return;
    
    try {
      setIsPublishing(true);
      await onBulkUnpublish(selectedIds);
    } catch (error) {
      console.error('Bulk unpublish failed:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  const isAnyActionLoading = isExporting || isDuplicating || isArchiving || isPublishing;

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-muted/50 border rounded-lg">
        <Badge variant="secondary" className="text-sm">
          {selectedCount} selected
        </Badge>
        
        <div className="flex items-center gap-1">
          {/* Quick actions */}
          {onBulkEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkEdit(selectedIds)}
              disabled={disabled || isLoading || isAnyActionLoading}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}

          {/* Export dropdown */}
          {onBulkExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={disabled || isLoading || isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-1" />
                  )}
                  Export
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkExport('xlsx')}>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* More actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={disabled || isLoading || isAnyActionLoading}
              >
                More
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {onBulkDuplicate && (
                <DropdownMenuItem 
                  onClick={handleBulkDuplicate}
                  disabled={isDuplicating}
                >
                  {isDuplicating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  Duplicate
                </DropdownMenuItem>
              )}
              
              {onBulkArchive && (
                <DropdownMenuItem 
                  onClick={handleBulkArchive}
                  disabled={isArchiving}
                >
                  {isArchiving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Archive className="mr-2 h-4 w-4" />
                  )}
                  Archive
                </DropdownMenuItem>
              )}

              {(onBulkPublish || onBulkUnpublish) && (
                <>
                  <DropdownMenuSeparator />
                  {onBulkPublish && (
                    <DropdownMenuItem 
                      onClick={handleBulkPublish}
                      disabled={isPublishing}
                    >
                      {isPublishing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      Publish
                    </DropdownMenuItem>
                  )}
                  
                  {onBulkUnpublish && (
                    <DropdownMenuItem 
                      onClick={handleBulkUnpublish}
                      disabled={isPublishing}
                    >
                      {isPublishing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <EyeOff className="mr-2 h-4 w-4" />
                      )}
                      Unpublish
                    </DropdownMenuItem>
                  )}
                </>
              )}

              {onBulkDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} item{selectedCount > 1 ? 's' : ''}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedCount} item{selectedCount > 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}