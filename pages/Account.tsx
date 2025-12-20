import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-[#2D2D2D]">Account Settings</h1>
        <p className="text-[#6B6B6B]">Manage your subscription and preferences</p>
      </header>

      <Card className="space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5]">
          <div>
            <h3 className="font-bold text-[#2D2D2D]">Subscription Status</h3>
            <p className="text-[#6B6B6B]">Monthly Clarity Plan — $7/mo</p>
          </div>
          <span className="bg-[#7AB8B8]/10 text-[#7AB8B8] px-3 py-1 rounded-full text-sm font-bold">
            {user?.subscriptionStatus || 'Active'}
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-[#2D2D2D]">Profile Information</h3>
          <div className="space-y-1">
            <p className="text-sm text-[#6B6B6B]">Name: <span className="text-[#2D2D2D] font-medium">{user?.name}</span></p>
            <p className="text-sm text-[#6B6B6B]">Email: <span className="text-[#2D2D2D] font-medium">{user?.email}</span></p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-[#2D2D2D]">Manage Billing</h3>
          <p className="text-sm text-[#6B6B6B]">Update your payment method or cancel your subscription through our secure billing portal.</p>
          <Button variant="secondary" className="w-full md:w-auto">Open Billing Portal</Button>
        </div>

        <hr className="border-[#E5E5E5]" />

        <div className="space-y-4">
          <h3 className="font-bold text-[#2D2D2D]">Usage Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-cream rounded-xl border border-[#E5E5E5] text-center"
            >
              <div className="text-2xl font-bold text-[#E8956B]">{user?.usageCount || 0}</div>
              <div className="text-xs text-[#6B6B6B] uppercase font-bold mt-1">Tools Used</div>
            </motion.div>
          </div>
        </div>
      </Card>

      <div className="text-center pt-8">
        <Button variant="text" onClick={handleLogout} className="text-red-500">Sign Out</Button>
      </div>
    </div>
  );
};

export default Account;