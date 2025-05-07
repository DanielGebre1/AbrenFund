import React from 'react';
import { FormDescription, FormLabel } from "../ui/form";
import { Upload, Trash2 } from 'lucide-react';

const MediaUpload = ({ 
  images, 
  onImageUpload, 
  onRemoveImage,
  labelText = "Campaign Images" 
}) => {
  return (
    <div className="space-y-4">
      <FormLabel>{labelText}</FormLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Image gallery */}
        {images.map((image, index) => (
          <div key={index} className="relative rounded-md overflow-hidden h-48">
            <img 
              src={image} 
              alt={`Campaign image ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(index)}
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-red-100"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))}
        
        {/* Upload button */}
        <label className="border-2 border-dashed border-muted-foreground/20 rounded-md h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-muted-foreground font-medium">Upload Image</span>
          <span className="text-xs text-muted-foreground">PNG, JPG or GIF, max 5MB</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={onImageUpload}
          />
        </label>
      </div>
      <FormDescription>
        Add up to 5 images. The first image will be your campaign thumbnail.
      </FormDescription>
    </div>
  );
};

export default MediaUpload;