import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSettings, uploadPicture } from '../services/settingsServices';

// Hook for updating user settings
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, settings }) => updateSettings(userId, settings),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries(['userData']);
      queryClient.invalidateQueries(['userProfile']);
    },
  });
}

// Hook for uploading profile picture
export function useProfilePictureUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, file }) => uploadPicture(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries(['userData']);
      queryClient.invalidateQueries(['userProfile']);
    },
  });
}

// Validation utilities
export const validateSettings = {
  file: (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, JPEG and PNG images are allowed.");
    }
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB.");
    }
  },

  form: (data) => {
    if (!data.username && !data.email && !data.password) {
      throw new Error("Please update at least one field.");
    }
    if (data.password && data.password !== data.repeatPassword) {
      throw new Error("Passwords do not match!");
    }
  }
};