export const CancellationPolicy = () => {
    return (
        <section className="bg-gray-50 min-h-screen py-12 px-4">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10">

                {/* TITLE */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                    Cancellation & Refund Policy
                </h1>

                <p className="text-lg text-gray-600 text-center mb-8">
                    Last Updated: April 2026
                </p>

                <hr className="mb-8" />

                {/* CONTENT */}
                <div className="space-y-8 text-lg leading-relaxed">

                    {/* 1 */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            1. Appointment Cancellation
                        </h2>
                        <p>
                            Customers can cancel their appointments through the platform
                            before the scheduled time. We recommend cancelling at least a few
                            hours in advance to avoid inconvenience.
                        </p>
                    </div>

                    {/* 2 */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            2. Cancellation Time Limit
                        </h2>
                        <p>
                            Appointments cancelled within the allowed time window will not
                            incur any penalty. However, cancellations made very close to the
                            scheduled time may be subject to restrictions or charges based on
                            salon policies.
                        </p>
                    </div>

                    {/* 3 */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            3. No-Show Policy
                        </h2>
                        <p>
                            If a customer fails to attend a scheduled appointment without
                            prior cancellation, it will be considered a "No-Show". Repeated
                            no-shows may lead to temporary suspension of booking privileges.
                        </p>
                    </div>

                    {/* 4 */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            4. Refund Policy
                        </h2>
                        <p>
                            Refunds are applicable only in specific cases such as duplicate
                            payments, technical issues, or service unavailability. Approved
                            refunds will be processed within 5–7 business days through the
                            original payment method.
                        </p>
                    </div>

                    {/* 5 */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            5. Late Arrival
                        </h2>
                        <p>
                            Customers are expected to arrive on time for their appointments.
                            Late arrival may result in reduced service time or rescheduling
                            based on staff availability.
                        </p>
                    </div>

                    {/* 6 */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            6. Salon Cancellation
                        </h2>
                        <p>
                            In rare cases, the salon may need to cancel or reschedule an
                            appointment due to unforeseen circumstances. Customers will be
                            informed promptly and offered an alternative slot or refund.
                        </p>
                    </div>

                    {/* 7 */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            7. Policy Changes
                        </h2>
                        <p>
                            We reserve the right to modify this Cancellation & Refund Policy
                            at any time. Updated policies will be reflected on this page.
                        </p>
                    </div>

                    {/* 8 */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">
                            8. Contact Us
                        </h2>
                        <p>
                            📧 Email: glowandgrace.business@gmail.com <br />
                            📞 Phone: +91 88102 69376
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
};