import React, { useEffect, useState } from 'react';
import axios from "../routes/axiosInstance";
import apiConfig from "../api-config";

interface Organization {
    id: number;
    name: string;
}

interface Props {
    onOrganizationChange: (org: Organization | null) => void;
}

const OrganizationSwitcher: React.FC<Props> = ({ onOrganizationChange }) => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [activeOrgId, setActiveOrgId] = useState<number | null>(null);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const res = await axios.get(`${apiConfig.apiUrl}/my-organizations`);
            const orgs: Organization[] = res.data || [];
            setOrganizations(orgs);

            if (orgs.length > 0) {
                fetchActiveOrganization(orgs);
            } else {
                setActiveOrgId(null);
                onOrganizationChange(null);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const fetchActiveOrganization = async (orgList: Organization[]) => {
        try {
            const res = await axios.get(`${apiConfig.apiUrl}/active-organization`);
            const activeOrg: Organization = res.data;

            setActiveOrgId(activeOrg.id);
            onOrganizationChange(activeOrg);
        } catch (err) {
            // No active org set — fallback to first one
            const fallback = orgList[0];
            setActiveOrgId(fallback.id);
            onOrganizationChange(fallback);

            try {
                await axios.post(`${apiConfig.apiUrl}/active-organization`, {
                    organization_id: fallback.id,
                });
            } catch (e) {
                console.error('Failed to set fallback active organization:', e);
            }
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        if (selectedId === activeOrgId) return; // skip if same

        setActiveOrgId(selectedId);

        try {
            await axios.post(`${apiConfig.apiUrl}/active-organization`, {
                organization_id: selectedId,
            });

            const selectedOrg = organizations.find(org => org.id === selectedId) || null;
            onOrganizationChange(selectedOrg);
        } catch (error) {
            console.error('Error setting active organization:', error);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Organization</label>
            <select
                value={activeOrgId ?? ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" disabled>Select an organization</option>
                {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                        {org.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default OrganizationSwitcher;
