'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DESIGNATION_TYPES } from '@/lib/constants';
import { parseRollNumber, formatRollNumber } from '@/lib/rollNumberParser';
import { getUserRoomAssignments } from '@/lib/roomManager';
import { CldUploadWidget } from 'next-cloudinary';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [rollNumberInfo, setRollNumberInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    profilePic: '',
    hasDesignation: false,
    designation: '',
    unit: '',
    extraInfo: '',
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setFormData(prev => ({ ...prev, name: session.user.user_metadata.full_name || '' }));
      } else {
        window.location.href = '/';
      }
    };
    getUser();
  }, []);

  // Parse roll number when it changes
  useEffect(() => {
    if (formData.rollNumber.length === 13) {
      const parsed = parseRollNumber(formData.rollNumber);
      setRollNumberInfo(parsed);
    } else {
      setRollNumberInfo(null);
    }
  }, [formData.rollNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.rollNumber || !formData.profilePic) {
      alert('Please fill all required fields');
      return;
    }

    // Validate roll number
    if (!rollNumberInfo || !rollNumberInfo.isValid) {
      alert(rollNumberInfo?.error || 'Invalid roll number');
      return;
    }

    setLoading(true);

    try {
      const { admissionYear, currentYear, branch } = rollNumberInfo;

      // Create user in database
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: user.email,
          name: formData.name,
          roll_number: formData.rollNumber,
          year: currentYear,
          branch: branch,
          profile_pic_url: formData.profilePic,
          batch_year: admissionYear,
        })
        .select()
        .single();

      if (userError) throw userError;

      // Get room assignments and create rooms if needed
      await getUserRoomAssignments(currentYear, branch);

      // If user has designation, create designation request
      if (formData.hasDesignation && formData.designation) {
        const { error: designationError } = await supabase
          .from('designations')
          .insert({
            user_id: newUser.id,
            designation_title: formData.designation,
            unit: formData.unit,
            status: 'pending',
          });

        if (designationError) throw designationError;

        // TODO: Send email to Anant about designation request
        // Will implement with Resend API in Week 9-10
      }

      // Redirect to feed
      window.location.href = '/feed';
    } catch (error: any) {
      console.error('Setup error:', error);
      alert('Error setting up profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to IET Akashvani! 🎉
        </h1>
        <p className="text-gray-600 mb-8">
          Let's set up your profile
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {formData.profilePic && (
                <img
                  src={formData.profilePic}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <CldUploadWidget
                uploadPreset="iet_akashvani"
                onSuccess={(result: any) => {
                  setFormData(prev => ({ ...prev, profilePic: result.info.secure_url }));
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Upload Photo
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.rollNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value.replace(/\D/g, '') }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter 13-digit roll number"
              maxLength={13}
              required
            />
            
            {/* Roll Number Info */}
            {formData.rollNumber.length > 0 && (
              <div className="mt-2">
                {rollNumberInfo?.isValid ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      ✓ Roll Number Detected
                    </p>
                    <div className="text-xs text-green-700 space-y-1">
                      <p>✅ Branch: {rollNumberInfo.branch}</p>
                      <p>✅ Batch: {rollNumberInfo.admissionYear}</p>
                      <p>✅ Current Year: {rollNumberInfo.currentYear}{['st', 'nd', 'rd', 'th'][rollNumberInfo.currentYear - 1]}</p>
                      <p>✅ Class Roll: {rollNumberInfo.classRollNumber}</p>
                      <p className="text-gray-600 mt-2">📋 Formatted: {formatRollNumber(formData.rollNumber)}</p>
                    </div>
                  </div>
                ) : formData.rollNumber.length === 13 ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      ✗ {rollNumberInfo?.error || 'Invalid roll number'}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Please check your roll number and try again.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Enter 13 digits (e.g., 2500520100112)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Designation Section */}
          <div className="border-t pt-6">
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.hasDesignation}
                onChange={(e) => setFormData(prev => ({ ...prev, hasDesignation: e.target.checked }))}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                I hold a designation
              </span>
            </label>

            {formData.hasDesignation && (
              <div className="space-y-4 pl-6 border-l-2 border-orange-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select designation</option>
                    {Object.entries(DESIGNATION_TYPES).map(([key, value]) => (
                      <option key={key} value={value}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel/Department/Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Ramanujan Hostel, CSE Department"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    value={formData.extraInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, extraInfo: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="Any additional details"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⏳ Your designation will show as "Pending Approval" until verified by admin
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
