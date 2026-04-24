import React from 'react'
import { FaFacebook, FaInstagram } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer>
            <div className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h3 className='text-primary font-bold text-2xl'>HerboSpot</h3>
                        <p className='text-sm text-gray-500'>Your trusted source for herbal remedies and natural wellness solutions.</p>
                        <address className='text-sm text-gray-500 not-italic'>
                            Gorkha 34100, Nepal<br />
                            Phone: +977-9834560001<br />
                            Email: info@herbospot.com
                        </address>
                    </div>

                    <div className='flex gap-5'>
                        <FaFacebook size={24} />
                        <FaInstagram size={24} />
                    </div>
                </div>

                <p className="text-xs text-gray-500">© 2022, HerboSpot. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer  