'use client';

import React, { useState } from 'react';
import { EmployeeProfile } from '../../types';
import { profileService } from '../../services/profileService';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface EditProfileModalProps {
  profile: EmployeeProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [phone, setPhone] = useState(profile.phone || '');
  const [address, setAddress] = useState(profile.address || '');
  const [city, setCity] = useState(profile.city || '');
  const [state, setState] = useState(profile.state || '');
  const [postalCode, setPostalCode] = useState(profile.postalCode || '');
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await profileService.updateProfile({
        phone,
        address,
        city,
        state,
        postalCode,
        profilePicture,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Personal Contact Details" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 000-0000"
        />

        <Input
          label="Residential Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Tech Boulevard"
        />

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <Input
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <Input
          label="Profile Picture Avatar URL"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          placeholder="https://..."
        />

        <div className="flex justify-end space-x-3 pt-3">
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
