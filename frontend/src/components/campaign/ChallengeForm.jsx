import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Calendar,
  Clock,
  Coins,
  Trophy,
  Building,
  Briefcase,
  ImageIcon,
} from 'lucide-react';
import MediaUpload from './MediaUpload';

const challengeFormSchema = z.object({
  title: z.string().min(5, {
    message: "Challenge title must be at least 5 characters.",
  }),
  shortDescription: z.string().min(10, {
    message: "Short description must be at least 10 characters.",
  }),
  fullDescription: z.string().min(50, {
    message: "Challenge description must be at least 50 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  rewardAmount: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Reward amount must be a positive number." }
  ),
  submissionDeadline: z.string({
    required_error: "Please select a submission deadline.",
  }),
  expectedDeliveryDate: z.string({
    required_error: "Please select an expected delivery date.",
  }),
  eligibilityCriteria: z.string().min(10, {
    message: "Eligibility criteria must be at least 10 characters.",
  }),
  projectScope: z.string().min(50, {
    message: "Project scope must be at least 50 characters.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  companyDescription: z.string().min(50, {
    message: "Company description must be at least 50 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please provide a valid contact email.",
  }),
  thumbnailImage: z.any().optional(),
});

const ChallengeForm = ({ onSubmit, images, onImageUpload, onRemoveImage }) => {
  const form = useForm({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      category: "",
      rewardAmount: "",
      submissionDeadline: "",
      expectedDeliveryDate: "",
      eligibilityCriteria: "",
      projectScope: "",
      companyName: "",
      companyDescription: "",
      contactEmail: "",
      thumbnailImage: null,
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          {/* Company Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Company Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="company@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your company/organization"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Challenge Information */}
          <div className="space-y-6 pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Challenge Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a clear, specific title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Be specific about what you're looking for
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
                        <SelectItem value="innovation-tech">Innovation & Tech</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Input placeholder="A brief summary of your challenge" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will appear in challenge previews (max 100 characters)
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
                  <FormLabel>Challenge Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the challenge in detail"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Project Requirements */}
          <div className="space-y-6 pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Project Requirements</h2>
            </div>

            <FormField
              control={form.control}
              name="projectScope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Scope</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Define the scope of work for this challenge"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Clearly outline what deliverables are expected
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eligibilityCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Specify who can apply for this challenge"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    List any requirements for applicants
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Reward & Timeline */}
          <div className="space-y-6 pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Reward & Timeline</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="rewardAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Amount (ETB)</FormLabel>
                    <FormControl>
                      <Input placeholder="10000" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="submissionDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Submission Deadline</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 opacity-50" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedDeliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Delivery Date</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 opacity-50" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              labelText="Challenge Images"
            />

            <FormField
              control={form.control}
              name="thumbnailImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        field.onChange(e.target.files[0]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the main image displayed for your challenge
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t flex justify-end">
            <Button type="submit" size="lg" className="px-8">
              Submit Challenge
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChallengeForm;