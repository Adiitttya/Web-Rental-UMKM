import React from 'react';
import { prisma } from '@/lib/prisma';
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity';
import { WebsiteStatus } from '@/components/admin/dashboard/WebsiteStatus';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  try {
    const [
      gameCount,
      pricingCount,
      eventCount,
      galleryCount,
      branchCount,
      testimonialCount,
      faqCount,
      feedbackCount,
      unreadFeedbackCount,
      recentActivities,
    ] = await Promise.all([
      prisma.hardware.count().catch(() => 0),
      prisma.pricingItem.count().catch(() => 0),
      prisma.event.count().catch(() => 0),
      prisma.galleryPhoto.count().catch(() => 0),
      prisma.branch.count().catch(() => 0),
      prisma.testimonial.count().catch(() => 0),
      prisma.faqItem.count().catch(() => 0),
      prisma.feedback.count().catch(() => 0),
      prisma.feedback.count({ where: { isRead: false } }).catch(() => 0),
      prisma.activityLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }).catch(() => []),
    ]);

    return {
      stats: {
        gameCount,
        pricingCount,
        eventCount,
        galleryCount,
        branchCount,
        testimonialCount,
        faqCount,
        feedbackCount,
        unreadFeedbackCount,
      },
      recentActivities,
    };
  } catch {
    return {
      stats: {
        gameCount: 0,
        pricingCount: 0,
        eventCount: 0,
        galleryCount: 0,
        branchCount: 0,
        testimonialCount: 0,
        faqCount: 0,
        feedbackCount: 0,
        unreadFeedbackCount: 0,
      },
      recentActivities: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const { stats, recentActivities } = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* Live Database Metrics Grid */}
      <DashboardStats stats={stats} />

      {/* Operational Status & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WebsiteStatus />
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
}
