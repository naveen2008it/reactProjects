import * as yup from 'yup';

export const CATEGORIES = ['World', 'Business', 'Technology', 'Sports', 'Entertainment', 'Health', 'India'];

export const articleSchema = yup.object({
  title: yup.string().trim().required('Title is required').min(8, 'Title must be at least 8 characters'),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(CATEGORIES, 'Please select a valid category'),
  author: yup.string().trim().required('Author is required').min(2, 'Author must be at least 2 characters'),
  imageUrl: yup
    .string()
    .trim()
    .required('Image URL is required')
    .url('Please enter a valid URL (http/https)'),
  summary: yup.string().trim().required('Summary is required').min(20, 'Summary must be at least 20 characters'),
  content: yup.string().trim().required('Content is required').min(50, 'Content must be at least 50 characters')
});
