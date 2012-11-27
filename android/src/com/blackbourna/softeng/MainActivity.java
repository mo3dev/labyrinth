package com.blackbourna.softeng;

import org.apache.cordova.DroidGap;

import android.content.Context;
import android.os.Bundle;
import android.os.PowerManager;
import android.view.Menu;
public class MainActivity extends DroidGap {
    PowerManager.WakeLock wakelock;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main);
        PowerManager pm = (PowerManager) this
        	    .getSystemService(Context.POWER_SERVICE);
        	    wakelock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK |
        	            PowerManager.ACQUIRE_CAUSES_WAKEUP
        	            | PowerManager.ON_AFTER_RELEASE, "MazeBallWakeLock");
        wakelock.acquire();
        super.loadUrl("file:///android_asset/www/soft_eng.html");
        
    }
	@Override
	public void onDestroy() {
		// TODO Auto-generated method stub
		wakelock.release();
		super.onDestroy();
	}



	@Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }
}
