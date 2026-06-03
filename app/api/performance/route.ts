import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

    // 1. In a production environment, you'll exchange a saved refresh token for a live access token.
    // For now, we assume you have an active access token or are routing through your OAuth flow.
    const accessToken = 'YOUR_ACCESS_TOKEN'; 

    // 2. Define the Google Performance API endpoint for your specific business location
    // Metric names include: BUSINESS_IMPRESSIONS_DESKTOP_MAPS, BUSINESS_ACTIONS_PHONE_CALLS, etc.
    const googleApiUrl = `https://businessprofileperformance.googleapis.com/v1/${locationId}:fetchMultiDailyMetricsTimeSeries`;

    // 3. Configure the payload requesting data for the last few months
    const payload = {
      dailyMetrics: [
        "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
        "BUSINESS_IMPRESSIONS_MOBILE_SEARCH"
      ],
      timeRange: {
        startTime: {
          year: 2026,
          month: 1,
          day: 1
        },
        endTime: {
          year: 2026,
          month: 5,
          day: 31
        }
      }
    };

    // 4. Send the authorized request to Google
    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Google API Error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();

    // 5. Return the clean data to your frontend dashboard
    return NextResponse.json({ success: true, metrics: data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}