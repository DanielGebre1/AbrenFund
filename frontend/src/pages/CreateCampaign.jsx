import React, { useState, useEffect } from 'react';
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
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Upload,
  Image,
  Calendar,
  Target,
  Info,
  Trash2,
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { checkAuthAndRedirect } from '../utils/authRedirect';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Campaign title must be at least 5 characters.' }),
  shortDescription: z.string().min(10, { message: 'Short description must be at least 10 characters.' }),
  fullDescription: z.string().min(50, { message: 'Full description must be at least 50 characters.' }),
  category: z.string({ required_error: 'Please select a category.' }),
  fundingGoal: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Funding goal must be a positive number.',
  }),
  endDate: z.string({ required_error: 'Please select an end date.' }),
  thumbnailImage: z.string().optional(),
});

const CreateCampaign = () => {
  const [images, setImages] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndRedirect('/login');
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      fullDescription: '',
      category: '',
      fundingGoal: '',
      endDate: '',
      thumbnailImage: '',
    },
  });

  const onSubmit = (values) => {
    console.log(values, images);
    toast({
      title: 'Campaign submitted',
      description: 'Your campaign has been submitted for review.',
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
          <p className="text-muted-foreground mb-8">
            Fill out the details below to launch your fundraising campaign
          </p>

          <div className="bg-white rounded-xl shadow p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Your form sections here — no changes needed from what you posted! */}
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
