import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { application_id, new_status, service_name } = body;

    if (!application_id || !new_status) {
      return Response.json({ error: 'application_id and new_status are required' }, { status: 400 });
    }

    const svc = service_name || 'the service';
    const svcTa = service_name || 'சேவைக்கான';

    // Bilingual notification templates keyed by application status
    const templates = {
      approved: {
        title_en: 'Application Approved',
        title_ta: 'விண்ணப்பம் அங்கீகரிக்கப்பட்டது',
        description_en: 'Your application for ' + svc + ' has been approved. You will receive further instructions shortly.',
        description_ta: svcTa + ' உங்கள் விண்ணப்பம் அங்கீகரிக்கப்பட்டது. மேலும் வழிமுறைகள் விரைவில் வழங்கப்படும்.',
        type: 'success',
        category: 'status_change',
        action_label_en: 'View Details',
        action_label_ta: 'விவரங்களைக் காண்க',
        action_link: '/dashboard',
      },
      under_review: {
        title_en: 'Application Under Review',
        title_ta: 'விண்ணப்பம் பரிசீலனையில்',
        description_en: 'Your application for ' + svc + ' is now under review by the relevant department.',
        description_ta: svcTa + ' உங்கள் விண்ணப்பம் தொடர்புடைய துறையால் பரிசீலனையில் உள்ளது.',
        type: 'info',
        category: 'status_change',
        action_label_en: 'Track Status',
        action_label_ta: 'நிலையைக் கண்காணிக்க',
        action_link: '/dashboard',
      },
      pending: {
        title_en: 'Application Pending',
        title_ta: 'விண்ணப்பம் நிலுவையில்',
        description_en: 'Your application for ' + svc + ' is pending and awaiting processing.',
        description_ta: svcTa + ' உங்கள் விண்ணப்பம் நிலுவையில் உள்ளது, செயலாக்கத்திற்காக காத்திருக்கிறது.',
        type: 'info',
        category: 'status_change',
        action_label_en: 'Track Status',
        action_label_ta: 'நிலையைக் கண்காணிக்க',
        action_link: '/dashboard',
      },
      rejected: {
        title_en: 'Application Rejected',
        title_ta: 'விண்ணப்பம் நிராகரிக்கப்பட்டது',
        description_en: 'Your application for ' + svc + ' was not approved. Please review the requirements or contact an officer.',
        description_ta: svcTa + ' உங்கள் விண்ணப்பம் அங்கீகரிக்கப்படவில்லை. தேவைகளைச் சரிபார்க்கவும் அல்லது அதிகாரியைத் தொடர்பு கொள்ளவும்.',
        type: 'action_required',
        category: 'action_required',
        action_label_en: 'Speak to Officer',
        action_label_ta: 'அதிகாரியைத் தொடர்பு கொள்ள',
        action_link: '/chat',
      },
      documents_required: {
        title_en: 'Action Required: Upload Documents',
        title_ta: 'செயல் தேவை: ஆவணங்களைப் பதிவேற்றவும்',
        description_en: 'Your application for ' + svc + ' requires additional documents to proceed. Please upload them at your earliest convenience.',
        description_ta: svcTa + ' உங்கள் விண்ணப்பத்திற்கு மேலும் ஆவணங்கள் தேவை. தயவுசெய்து பதிவேற்றவும்.',
        type: 'action_required',
        category: 'action_required',
        action_label_en: 'Upload Now',
        action_label_ta: 'இப்போது பதிவேற்று',
        action_link: '/dashboard',
      },
      human_review: {
        title_en: 'Human Review Requested',
        title_ta: 'மனித பரிசீலனை கோரப்பட்டது',
        description_en: 'Your application for ' + svc + ' has been escalated for human officer review.',
        description_ta: svcTa + ' உங்கள் விண்ணப்பம் மனித அதிகாரி பரிசீலனைக்காக முன்னெடுக்கப்பட்டது.',
        type: 'warning',
        category: 'action_required',
        action_label_en: 'View Details',
        action_label_ta: 'விவரங்களைக் காண்க',
        action_link: '/explainable-ai',
      },
    };

    const statusKey = new_status.toLowerCase().replace(/[\s-]+/g, '_');
    const template = templates[statusKey] || templates.pending;

    const notification = await base44.entities.Notification.create({
      title_en: template.title_en,
      title_ta: template.title_ta,
      description_en: template.description_en,
      description_ta: template.description_ta,
      type: template.type,
      category: template.category,
      read: false,
      application_id: application_id || null,
      service_name: service_name || null,
      action_label_en: template.action_label_en || null,
      action_label_ta: template.action_label_ta || null,
      action_link: template.action_link || null,
    });

    return Response.json({ success: true, notification });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});