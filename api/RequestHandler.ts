import apiClient, { setAuthHeaders } from './ApiClient';
import { handleError } from './ErrorHandler';
import axios, { AxiosRequestConfig } from 'axios';

export const getRequest = async <T>(
  url: string,
  authenticated = false,
): Promise<T> => {
  try {
    const headers: Record<string, string> = {};
    if (authenticated) {
      await setAuthHeaders(headers);
    }
    const response = await apiClient.get(url, { headers });
    return response.data;
  } catch (error) {
    await handleError(error);
    throw error;
  }
};

export const postRequest = async <T>(
  url: string,
  data: any,
  authenticated = false,
  isMultipart = false
): Promise<T> => {
  try {
    const headers: Record<string, string> = {};
    if (authenticated) {
      await setAuthHeaders(headers);
    }
    // Dynamically set Content-Type based on whether it's multipart/form-data or JSON
    if (isMultipart) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'application/json';
    }
    const response = await apiClient.post(url, data, { headers });
    return response.data;
  } catch (error) {
    await handleError(error);
    throw error;
  }
};

export const patchRequest = async <T>(
  url: string,
  data: any,
  authenticated = false,
  isMultipart = false
): Promise<T> => {
  try {
    const headers: Record<string, string> = {};
    if (authenticated) {
      await setAuthHeaders(headers);
    }
    // Dynamically set Content-Type based on whether it's multipart/form-data or JSON
    if (isMultipart) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'application/json';
    }
    const response = await apiClient.patch(url, data, { headers });
    return response.data;
  } catch (error) {
    await handleError(error);
    throw error;
  }
};

export const deleteRequest = async <T>(
  url: string,
  authenticated = false,
  isMultipart = false
): Promise<T> => {
  try {
    const headers: Record<string, string> = {};
    if (authenticated) {
      await setAuthHeaders(headers);
    }
    // Dynamically set Content-Type based on whether it's multipart/form-data or JSON
    if (isMultipart) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'application/json';
    }
    const response = await apiClient.delete(url, { headers });
    return response.data;
  } catch (error) {
    await handleError(error);
    throw error;
  }
};
