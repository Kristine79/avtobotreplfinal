import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X, Plus, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ImageUploadProps {
  onImagesSelect: (images: Array<{file: File, preview: string}>) => void;
  previews: string[];
  onClear: () => void;
  onRemoveImage: (index: number) => void;
  disabled?: boolean;
  maxImages?: number;
}

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 0.8;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', QUALITY);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function MultiImageUpload({ 
  onImagesSelect, 
  previews, 
  onClear, 
  onRemoveImage,
  disabled,
  maxImages = 10 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(async (files: FileList) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    const remaining = maxImages - previews.length;
    const toProcess = imageFiles.slice(0, remaining);
    
    const results: Array<{file: File, preview: string}> = [];
    
    for (const file of toProcess) {
      try {
        const compressedDataUrl = await compressImage(file);
        results.push({ file, preview: compressedDataUrl });
      } catch (error) {
        console.error('Image compression failed:', error);
        const reader = new FileReader();
        const preview = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        results.push({ file, preview });
      }
    }
    
    if (results.length > 0) {
      onImagesSelect(results);
    }
  }, [onImagesSelect, previews.length, maxImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  }, [handleFiles]);

  if (previews.length > 0) {
    return (
      <Card className="overflow-visible">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Images className="h-4 w-4" />
              <span>Загружено: {previews.length} из {maxImages}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onClear}
              disabled={disabled}
              data-testid="button-clear-all"
            >
              <X className="h-4 w-4 mr-1" />
              Очистить все
            </Button>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative flex-shrink-0 w-40 h-32">
                  <img
                    src={preview}
                    alt={`Фото ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                    data-testid={`img-preview-${index}`}
                  />
                  {!disabled && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => onRemoveImage(index)}
                      data-testid={`button-remove-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              
              {previews.length < maxImages && !disabled && (
                <label
                  htmlFor="add-more-images"
                  className="flex-shrink-0 w-40 h-32 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover-elevate"
                >
                  <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Добавить</span>
                  <input
                    id="add-more-images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleInputChange}
                    disabled={disabled}
                  />
                </label>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-visible">
      <CardContent className="p-0">
        <label
          htmlFor="image-upload"
          className={`flex flex-col items-center justify-center w-full h-72 cursor-pointer rounded-md transition-all hover-elevate ${
            isDragging
              ? "bg-primary/10 border-2 border-dashed border-primary"
              : "bg-muted/30 border-2 border-dashed border-border"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          data-testid="dropzone-image-upload"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-3">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Перетащите фото автомобиля сюда
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                или нажмите для выбора файлов
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <ImageIcon className="h-3 w-3" />
              <span>PNG, JPG, WEBP до 10МБ (до {maxImages} фото)</span>
            </div>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleInputChange}
            disabled={disabled}
            data-testid="input-image-upload"
          />
        </label>
      </CardContent>
    </Card>
  );
}
