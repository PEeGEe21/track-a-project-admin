"use server";
import { fetchWithAuth, parseApiResponse } from "@/lib/fetch-config";
export type IntegrationHealth={organizationId:string;endpoints:{total:number;active:number};deliveries:Record<string,number>};
export async function getIntegrationHealth(organizationId:string){const response=await fetchWithAuth(`/admin/integration-delivery/health?organizationId=${encodeURIComponent(organizationId)}`);return parseApiResponse<IntegrationHealth>(response);}
