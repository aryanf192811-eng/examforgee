import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ConfirmModal } from '../components/ui/Modal';
import { useToast } from '../hooks/useToast';
import { useAuthStore } from '../lib/store/authStore';
import { updateProfile } from '../lib/api';
import { formatNumber, formatDate, getInitials, hashColor, safeNum } from '../lib/utils';

export default function Profile() {
  const { addToast } = useToast();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const signOut = useAuthStore((s) => s.signOut);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editCollege, setEditCollege] = useState(user?.college || '');
  const [editGateYear, setEditGateYear] = useState(user?.gate_year?.toString() || '2025');
  const [editTargetScore, setEditTargetScore] = useState(user?.target_score?.toString() || '70');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) {
    return (
      <AppShell title="Profile">
        <Skeleton variant="card" />
      </AppShell>
    );
  }

  const userName = user.name || 'Student';
  const userBio = user.bio || 'No bio yet';
  const totalScore = safeNum((user as any).total_score || user.total_points);
  const streakDays = safeNum(user.current_streak);

  async function handleSave() {
    setIsSaving(true);
    try {
      const updated = await updateProfile({
        name: editName,
        bio: editBio,
        college: editCollege,
        gate_year: parseInt(editGateYear),
        target_score: parseFloat(editTargetScore)
      });
      setUser(updated);
      setIsEditing(false);
      addToast('Profile updated!', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell title="Profile">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="max-w-lg mx-auto space-y-6"
      >
        {/* Avatar & Info */}
        <div className="rounded-2xl bg-surface-container p-6 flex flex-col items-center text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-headline-md font-bold text-white mb-4"
            style={{ backgroundColor: hashColor(userName) }}
          >
            {getInitials(userName)}
          </div>

          {isEditing ? (
            <div role="form" className="w-full space-y-4 mt-2">
              <Input
                label="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                icon="person"
              />
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-label-lg text-on-surface-variant">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  className="w-full bg-surface-container-high text-on-surface text-body-md rounded-xl p-3 outline-none resize-none h-20 focus:ring-2 focus:ring-primary/30 placeholder:text-outline font-body"
                />
              </div>
              <Input
                label="College"
                value={editCollege}
                onChange={(e) => setEditCollege(e.target.value)}
                icon="school"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="GATE Year"
                  type="number"
                  value={editGateYear}
                  onChange={(e) => setEditGateYear(e.target.value)}
                  icon="calendar_today"
                />
                <Input
                  label="Target Score"
                  type="number"
                  value={editTargetScore}
                  onChange={(e) => setEditTargetScore(e.target.value)}
                  icon="track_changes"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={isSaving} fullWidth>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-display text-headline-md text-on-surface mb-1">
                {userName}
              </h2>
              <p className="text-body-md text-on-surface-variant mb-3">
                {userBio}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="primary">{user.role}</Badge>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon="edit"
                onClick={() => {
                  setEditName(user.name || '');
                  setEditBio(user.bio || '');
                  setEditCollege(user.college || '');
                  setEditGateYear(user.gate_year?.toString() || '2025');
                  setEditTargetScore(user.target_score?.toString() || '70');
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </Button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-surface-container p-4 text-center">
            <span className="font-display text-headline-sm text-primary block">
              {formatNumber(totalScore)}
            </span>
            <span className="text-label-md text-on-surface-variant">Score</span>
          </div>
          <div className="rounded-2xl bg-surface-container p-4 text-center">
            <span className="font-display text-headline-sm text-secondary block">
              {streakDays}
            </span>
            <span className="text-label-md text-on-surface-variant">Streak</span>
          </div>
          <div className="rounded-2xl bg-surface-container p-4 text-center">
            <span className="font-display text-headline-sm text-tertiary block">
              {formatDate(user.created_at)}
            </span>
            <span className="text-label-md text-on-surface-variant">Joined</span>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl bg-surface-container p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-on-surface-variant">Email</span>
            <span className="text-body-md text-on-surface">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-on-surface-variant">College</span>
            <span className="text-body-md text-on-surface">{user.college || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-on-surface-variant">GATE Year</span>
            <span className="text-body-md text-on-surface">{user.gate_year || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-on-surface-variant">Target Score</span>
            <span className="text-body-md text-on-surface">{user.target_score || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-on-surface-variant">Role</span>
            <Badge variant="primary" size="sm">{user.role}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-on-surface-variant">Joined</span>
            <span className="text-body-md text-on-surface">{formatDate(user.created_at)}</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl bg-error-container/10 p-5">
          <h3 className="font-headline text-title-md text-error mb-2">
            Danger Zone
          </h3>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Once you delete your account, there is no going back.
          </p>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              size="sm"
              icon="delete"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="logout"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation modal — required for destructive actions */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          addToast('Account deletion requested. Contact support.', 'info');
        }}
        title="Delete Account"
        description="Are you sure you want to delete your account? All data will be permanently removed. This action cannot be undone."
        confirmLabel="Delete My Account"
        variant="destructive"
      />
    </AppShell>
  );
}
