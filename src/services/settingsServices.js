import { v4 as uuidv4 } from "uuid";
import supabase from "../utility/SupabaseClient";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Constants
const BUCKET_NAME = "plaintalkpostuploads";
const PROFILE_PICTURES_PATH = "uploads/profile_pictures";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// S3 Client Configuration
const s3Client = new S3Client({
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_DIGITAL_OCEAN_SPACES_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_DIGITAL_OCEAN_SPACES_SECRET_KEY,
  },
});

// Validation Functions
const validateFile = (file) => {
  if (!file) throw new Error("No file provided.");
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, JPEG and PNG are allowed.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit.");
  }
};

const validateSettings = ({ username, email, password }) => {
  if (username && username.length < 3) {
    throw new Error("Username must be at least 3 characters long.");
  }
  if (email && !email.includes("@")) {
    throw new Error("Invalid email format.");
  }
  if (password && password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
};

// S3 Operations
const uploadToS3 = async (file, fileName) => {
  const fileContent = await file.arrayBuffer();
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: `${PROFILE_PICTURES_PATH}/${fileName}`,
    Body: fileContent,
    ACL: "public-read",
    ContentType: file.type,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file to storage.");
  }
};

const deleteFromS3 = async (fileName) => {
  if (!fileName) return;
  
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: `${PROFILE_PICTURES_PATH}/${fileName}`,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error("S3 deletion error:", error);
    // Don't throw here - old file deletion shouldn't break the upload process
  }
};

// Database Operations
const getPreviousProfilePicture = async (userId) => {
  const { data, error } = await supabase
    .from("users_extended")
    .select("profile_picture")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Database query error:", error);
    return null;
  }
  return data?.profile_picture || null;
};

const updateUserProfilePicture = async (userId, profilePicFileName) => {
  const { error } = await supabase
    .from("user_profile")
    .update({ profile_picture: profilePicFileName })
    .eq("user_id", userId);

  if (error) {
    console.error("Database update error:", error);
    throw new Error("Failed to update profile picture in database.");
  }
};

// Use string manipulation instead of path module
const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

const generateFileName = (originalName) => {
  const ext = getFileExtension(originalName);
  return `${uuidv4()}.${ext}`;
};

// Main Export Functions
export async function uploadPicture(userId, file) {
  try {
    // Validate input
    validateFile(file);

    // Generate unique filename
    const uniqueFileName = generateFileName(file.name);

    // Get previous picture for cleanup
    const previousPicture = await getPreviousProfilePicture(userId);

    // Upload new picture
    await uploadToS3(file, uniqueFileName);

    // Update database
    await updateUserProfilePicture(userId, uniqueFileName);

    // Clean up old picture
    await deleteFromS3(previousPicture);

    return uniqueFileName;
  } catch (error) {
    console.error("Upload picture error:", error);
    throw new Error(error.message || "Failed to upload profile picture.");
  }
}

export async function updateSettings(userId, settings) {
  try {
    // Validate settings
    validateSettings(settings);
    
    const { username, email, password } = settings;

    // Update username if provided
    if (username) {
      const { error: usernameError } = await supabase
        .from("users_extended")
        .update({ username })
        .eq("user_id", userId);

      if (usernameError) {
        if (usernameError.message.includes("duplicate key value")) {
          throw new Error("Username already taken. Please choose a different one.");
        }
        throw new Error("Error updating username.");
      }
    }

    // Update auth details if provided
    const authUpdates = {};
    if (email) authUpdates.email = email;
    if (password) authUpdates.password = password;

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabase.auth.updateUser(authUpdates);
      if (authError) throw new Error(authError.message);
    }

    return { 
      success: true, 
      message: "Settings successfully updated.",
      updatedFields: {
        username: !!username,
        email: !!email,
        password: !!password
      }
    };
  } catch (error) {
    console.error("Update settings error:", error);
    throw new Error(error.message || "Failed to update settings.");
  }
}
