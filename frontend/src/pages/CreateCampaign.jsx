import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '../components/ui/select';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, Image, Calendar, Target, Tag, Info, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { checkAuthAndRedirect } from '../utils/authRedirect';
import { useEffect } from 'react';

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Campaign title must be at least 5 characters.",
  }),
  shortDescription: z.string().min(10, {
    message: "Short description must be at least 10 characters.",
  }),
  fullDescription: z.string().min(50, {
    message: "Full description must be at least 50 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  fundingGoal: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: "Funding goal must be a positive number." }
  ),
  endDate: z.string({
    required_error: "Please select an end date.",
  }),
  thumbnailImage: z.string().optional(),
});

const CreateCampaign = () => {
  const [images, setImages] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in, redirect if not
    checkAuthAndRedirect('/login');
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      category: "",
      fundingGoal: "",
      endDate: "",
      thumbnailImage: "",
    },
  });

  const onSubmit = (values) => {
    console.log(values, images);
    toast({
      title: "Campaign submitted",
      description: "Your campaign has been submitted for review.",
    });
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImages([...images, reader.result.toString()]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Create a New Campaign</h1>
          <p className="text-muted-foreground mb-8">Fill out the details below to launch your fundraising campaign</p>
          
          <div className="bg-white rounded-xl shadow p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a clear, specific title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Be specific and memorable
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Input placeholder="A brief summary of your campaign" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will appear in search results and previews
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fullDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Explain your project in detail. What are you creating? Why is it important?" 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Tell your story and explain why people should support you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="community">Community</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="environment">Environment</SelectItem>
                            <SelectItem value="arts">Arts & Culture</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the category that best fits your project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Funding Details */}
                <div className="space-y-6 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Funding Details</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="fundingGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Goal (ETB)</FormLabel>
                        <FormControl>
                          <Input placeholder="5000" type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Set a realistic amount you need to complete your project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign End Date</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 opacity-50" />
                            <Input type="date" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Campaigns can run up to 60 days
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Media Section */}
                <div className="space-y-6 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Image className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Media</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <FormLabel>Campaign Images</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            onClick={() => removeImage(index)}
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
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <FormDescription>
                      Add up to 5 images. The first image will be your campaign thumbnail.
                    </FormDescription>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-6 border-t flex justify-end">
                  <Button type="submit" size="lg">
                    Submit Campaign for Review
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateCampaign;