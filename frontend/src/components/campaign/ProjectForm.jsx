import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form, FormControl, FormDescription, FormField, FormItem,
  FormLabel, FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Calendar, Target, Tag, Info, ImageIcon
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import MediaUpload from './MediaUpload';

const projectFormSchema = z.object({
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
  fundingType: z.enum(["all_or_nothing", "keep_what_you_raise"]),
  thumbnailImage: z.string().optional(),
});

const ProjectForm = ({ onSubmit, images, onImageUpload, onRemoveImage }) => {
  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      category: "",
      fundingGoal: "",
      endDate: "",
      fundingType: "all_or_nothing",
      thumbnailImage: "",
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a clear, specific title" {...field} />
                    </FormControl>
                    <FormDescription>Be specific and memorable</FormDescription>
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
                        <SelectItem value="innovation-tech">Innovation & Tech</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
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
                    This will appear in search results and previews (max 100 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Full Description */}
          <div className="space-y-6 pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Full Story</h2>
            </div>

            <FormField
              control={form.control}
              name="fullDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
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
          </div>

          {/* Funding Details */}
          <div className="space-y-6 pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Funding Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <FormField
              control={form.control}
              name="fundingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all_or_nothing" id="all_or_nothing" />
                        <label htmlFor="all_or_nothing" className="cursor-pointer">
                          All or Nothing (receive funds only if goal is met)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="keep_what_you_raise" id="keep_what_you_raise" />
                        <label htmlFor="keep_what_you_raise" className="cursor-pointer">
                          Keep What You Raise (receive funds regardless of goal)
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Choose how you want to receive funds when your campaign ends
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Media Section */}
          <div className="space-y-6 pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Media</h2>
            </div>

            <MediaUpload
              images={images}
              onImageUpload={onImageUpload}
              onRemoveImage={onRemoveImage}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t flex justify-end">
            <Button type="submit" size="lg" className="px-8">
              Submit Campaign for Review
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;
