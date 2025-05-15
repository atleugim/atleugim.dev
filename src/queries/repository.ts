import { GITHUB_STATIC_FILE_BASE_ENDPOINT } from "~/lib/const";

export const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch(
      `${GITHUB_STATIC_FILE_BASE_ENDPOINT}/jobs.json`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(
      `${GITHUB_STATIC_FILE_BASE_ENDPOINT}/projects.json`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};
